<script lang="ts">
    let { header, href, children } = $props<{
        header: string;
        href: string;
        children?: () => unknown;
    }>();
</script>

<a
    class="card h-40 cursor-pointer bg-base-200/60 shadow-md transition-all hover:bg-base-200 hover:shadow-lg focus:ring-2 focus:ring-primary focus:outline-none"
    {href}
>
    <h3 class="pt-3 pl-5 text-xl font-bold">
        {header}
    </h3>
    {#if children}
        {@render children()}
    {/if}
</a>
