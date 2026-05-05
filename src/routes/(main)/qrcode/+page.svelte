<script lang="ts">
    import QRCode from "qrcode";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let src = $state("");
    let previousRank = $state<number | null>(null);
    let currentQueueRank = $state<number | null>(null);
    let currentQueueError = $state<string | null>(null);
    let pollIntervalId: ReturnType<typeof setInterval> | null = null;

    const POLL_INTERVAL = 10 * 1000;
    const QUEUE_STATUS_URL_DEV = "http://localhost:5173/queue/status";
    const QUEUE_STATUS_URL_PROD = "https://systems.server.kvznmx.com/queue/status";
    const isDev = import.meta.env.DEV;

    // Helper to convert VAPID key
    function urlBase64ToUint8Array(base64String: string) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async function enablePush() {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            alert("Push messaging is not supported in this browser.");
            return;
        }

        // Ask for notification permission first
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("Notification permission denied");
            return;
        }

        // Get VAPID public key from server
        const res = await fetch("/api/push/vapid");
        if (!res.ok) {
            alert(
                "Unable to get VAPID public key from server. Configure VAPID keys on the server."
            );
            return;
        }
        const { publicKey } = await res.json();

        const reg = await navigator.serviceWorker.ready;
        try {
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey)
            });

            // Send subscription to server
            await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub)
            });

            alert("Push subscription created successfully");
        } catch (e) {
            console.error("Push subscription failed", e);
            alert("Push subscription failed: " + e);
        }
    }

    $effect.pre(() => {
        // Initialize from server data on mount
        if (currentQueueRank === null && currentQueueError === null) {
            currentQueueRank = data.queueRank;
            currentQueueError = data.queueRankError;
        }
    });

    $effect(() => {
        const email = data.session?.user?.email ?? "Bad User";
        let cancelled = false;

        // TODO: Maybe add some encryption to the email to prevent impersonation
        QRCode.toDataURL(email)
            .then((url) => {
                if (!cancelled) src = url;
            })
            .catch(() => {
                if (!cancelled) src = "";
            });

        return () => {
            cancelled = true;
        };
    });

    $effect(() => {
        const currentRank = currentQueueRank;

        // Only show notification if rank changed to 1, 2, or 3
        if (currentRank && [1, 2, 3].includes(currentRank) && currentRank !== previousRank) {
            previousRank = currentRank;
            showQueuePositionNotification(currentRank);
        } else if (currentRank && currentRank !== previousRank) {
            previousRank = currentRank;
        }
    });

    async function fetchQueueRank() {
        const email = data.session?.user?.email;
        if (!email) return;

        const origin = isDev ? QUEUE_STATUS_URL_DEV : QUEUE_STATUS_URL_PROD;
        const url = new URL(origin);
        url.searchParams.set("userEmail", email);

        try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                currentQueueError = "Unable to fetch queue rank right now.";
                return;
            }

            const rankText = (await response.text()).trim();
            const rank = Number.parseInt(rankText, 10);

            if (!Number.isInteger(rank) || rank < 1) {
                currentQueueError = "Queue rank is currently unavailable.";
                return;
            }

            currentQueueRank = rank;
            currentQueueError = null;
        } catch {
            currentQueueError = "Queue rank is currently unavailable.";
        }
    }

    function startPolling() {
        // Initial fetch
        fetchQueueRank();

        // Poll every 30 seconds
        pollIntervalId = setInterval(() => {
            fetchQueueRank();
        }, POLL_INTERVAL);
    }

    function stopPolling() {
        if (pollIntervalId !== null) {
            clearInterval(pollIntervalId);
            pollIntervalId = null;
        }
    }

    $effect(() => {
        startPolling();

        return () => {
            stopPolling();
        };
    });

    function showQueuePositionNotification(position: number) {
        // Request notification permission if not already granted
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        // Show notification if permission is granted
        if ("Notification" in window && Notification.permission === "granted") {
            const messages: Record<number, string> = {
                1: "🎉 You're next! Get ready!",
                2: "⏱️ Almost there! 2nd in queue",
                3: "👀 3rd in queue"
            };

            new Notification("Queue Update", {
                body: messages[position] || `You're #${position} in queue`,
                badge: "/favicon.svg",
                tag: "queue-position",
                requireInteraction: position === 1
            });
        }
    }
</script>

<section
    class="mx-auto flex min-h-[78svh] w-full max-w-xl flex-col items-center justify-center px-5 pb-12"
>
    <div class="absolute top-20 right-4 z-40">
        <button class="btn btn-sm" onclick={enablePush}>Enable Notifications</button>
    </div>

    <h1 class="text-center text-3xl font-black tracking-tight">Your Queue QR</h1>
    <p class="mt-2 text-center text-base text-base-content/75">
        Raise brightness for faster scanning
    </p>
    <p class="mt-1 text-center text-sm text-base-content/80">
        {#if currentQueueRank}
            Queue position: #{currentQueueRank}
        {:else}
            {currentQueueError}
        {/if}
    </p>

    <div class="mt-6 w-full max-w-[24rem] rounded-3xl bg-white p-4 shadow-2xl">
        <img {src} alt="QRCode" class="h-auto w-full" />
    </div>
</section>
