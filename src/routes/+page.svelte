<script lang="ts">
    let { data } = $props();

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
</script>

<section class="mx-auto flex min-h-[74svh] w-full max-w-xl items-center px-5 pb-10">
    <div class="w-full rounded-3xl border border-base-300 bg-base-200/85 p-7 shadow-xl sm:p-8">
        <div class="absolute top-20 right-4 z-40">
            <button class="btn btn-sm" on:click={enablePush}>Enable Notifications</button>
        </div>

        <p class="mb-2 text-sm tracking-[0.2em] text-base-content/60 uppercase">Queue Pass</p>
        <h1 class="text-4xl leading-tight font-black sm:text-5xl">QR Code Generator</h1>

        <a href="/qrcode" class="btn mt-7 btn-block text-base btn-lg btn-primary">Open QR Code</a>

        {#if data.session?.user?.email}
            <p class="mt-5 truncate text-center text-sm text-base-content/70">
                {data.session.user.email}
            </p>
        {:else}
            <p class="mt-5 text-center text-sm text-base-content/70">
                Sign in to generate your QR code
            </p>
        {/if}
    </div>
</section>
