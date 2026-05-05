<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import Navbar from "$lib/components/Navbar.svelte";
    import { onMount } from "svelte";

    let { children, data } = $props();

    // Register the service worker on client
    onMount(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then(() => {
                    // service worker registered
                })
                .catch(() => {
                    // console.warn('Service worker registration failed');
                });
        }
    });




</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navbar {data} />
<div class="pt-24 md:pt-20">
    {@render children()}
</div>
