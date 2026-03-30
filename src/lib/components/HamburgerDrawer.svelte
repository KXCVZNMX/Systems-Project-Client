<script lang="ts">
    import HamburgerIcon from "$lib/components/HamburgerIcon.svelte";
    import DefaultAvatar from "$lib/assets/default-avatar.svg";
    import { signIn, signOut } from "@auth/sveltekit/client"

    let { data } = $props();
    let open = $state(false);
</script>

<div
    class="fixed bottom-6 left-4 z-50 md:hidden"
    role="button"
    aria-label={open ? "Close menu" : "Open menu"}
    tabindex={0}
    onclick={() => (open = !open)}
    onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") open = !open;
    }}
>
    <HamburgerIcon {open} />
</div>

<div
    class={open
        ? "pointer-events-auto fixed inset-0 z-40 bg-base-200/60 opacity-100 backdrop-blur-sm transition-opacity"
        : "pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity"}
    aria-hidden={!open}
    onclick={() => (open = false)}
></div>

<div
    class={open
        ? "fixed top-0 left-0 z-50 h-full w-72 max-w-[80%] translate-x-0 transform bg-base-100 shadow-xl transition-transform md:hidden"
        : "fixed top-0 left-0 z-50 h-full w-72 max-w-[80%] -translate-x-full transform bg-base-100 shadow-xl transition-transform md:hidden"}
    role="dialog"
    aria-modal="true"
>
    <div>
        <div class="p-4">
            <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-semibold">Menu</h3>
                <button onclick={() => (open = false)} aria-label="Close menu">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M6 6L18 18M6 18L18 6"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <nav>
                <ul class="flex flex-col gap-2">
                    <li>
                        <a
                            href="/"
                            class="block rounded px-3 py-2 hover:bg-base-200"
                            onclick={() => (open = false)}
                        >
                            Home
                        </a>
                    </li>
                </ul>

                <div class="mt-4 border-t border-base-200 pt-4">
                    {#if data.session}
                        <div class="flex flex-col gap-3 px-3">
                            <div class="flex items-center gap-3">
                                <img src={data.session.user.image ?? DefaultAvatar} alt="User Avatar" class="h-10 w-10 rounded-full"/>
                                <div class="text-sm font-medium">
                                    {data.session?.user?.name}
                                </div>
                            </div>

                            <ul class="flex flex-col gap-2">
                                <li>
                                    <button onclick={() => signOut()} aria-label="Logout" title="Logout" role="menuitem" class="text-red-500 block px-3 py-2 rounded hover:bg-base-200 w-full text-left">
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    {:else}
                        <div class="px-3">
                            <button class="inline-block px-3 py-2 btn btn-primary w-full text-center" onclick={() => signIn()}>
                                Login
                            </button>
                        </div>
                    {/if}
                </div>
            </nav>
        </div>
    </div>
</div>
