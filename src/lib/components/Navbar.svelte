<script lang="ts">
    import HamburgerDrawer from "$lib/components/HamburgerDrawer.svelte";

    let { data } = $props();
</script>

<nav class="navbar fixed top-0 z-50 backdrop-blur-sm">
    <div class="p-2">
        <a href="/" class="btn text-2xl text-white btn-ghost">QB</a>
    </div>
</nav>

<HamburgerDrawer {data} />
