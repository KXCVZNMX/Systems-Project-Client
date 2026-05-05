<script lang="ts">
    import HamburgerDrawer from "$lib/components/HamburgerDrawer.svelte";

    let { data } = $props();
</script>

<nav class="navbar fixed top-0 z-50 w-full bg-base-100/65 backdrop-blur-md">
    <div class="px-3 py-2">
        <a href="/" class="btn h-12 min-h-12 px-4 text-2xl font-black text-white btn-ghost">QB</a>
    </div>
</nav>

<HamburgerDrawer {data} />
