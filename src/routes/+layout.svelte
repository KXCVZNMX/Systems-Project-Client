<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import Navbar from "$lib/components/Navbar.svelte";
    import { onMount } from 'svelte';

    let { children, data } = $props();

    // Register the service worker on client
    onMount(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => {
                    // service worker registered
                })
                .catch(() => {
                    // console.warn('Service worker registration failed');
                });
        }
    });

    // Helper to convert VAPID key
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async function enablePush() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            alert('Push messaging is not supported in this browser.');
            return;
        }

        // Ask for notification permission first
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('Notification permission denied');
            return;
        }

        // Get VAPID public key from server
        const res = await fetch('/api/push/vapid');
        if (!res.ok) {
            alert('Unable to get VAPID public key from server. Configure VAPID keys on the server.');
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
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });

            alert('Push subscription created successfully');
        } catch (e) {
            console.error('Push subscription failed', e);
            alert('Push subscription failed: ' + e);
        }
    }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar {data}/>
<div class="fixed right-4 top-20 z-50">
    <button class="btn btn-sm" on:click={enablePush}>Enable Notifications</button>
</div>
<div class="pt-24 md:pt-20">
    {@render children()}
</div>
