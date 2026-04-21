<script lang="ts">
    import HamburgerIcon from "$lib/components/HamburgerIcon.svelte";
    import DefaultAvatar from "$lib/assets/default-avatar.svg";
    import { signIn, signOut } from "@auth/sveltekit/client"

    let { data } = $props();
    let open = $state(false);
</script>

<div
    class="fixed bottom-5 left-4 z-50 md:hidden"
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
        ? "fixed top-0 left-0 z-50 h-full w-[82%] max-w-[22rem] translate-x-0 transform bg-base-100 shadow-xl transition-transform md:hidden"
        : "fixed top-0 left-0 z-50 h-full w-[82%] max-w-[22rem] -translate-x-full transform bg-base-100 shadow-xl transition-transform md:hidden"}
    role="dialog"
    aria-modal="true"
>
    <div>
        <div class="p-5">
            <div class="mb-5 flex items-center justify-between">
                <h3 class="text-xl font-semibold">Menu</h3>
                <button onclick={() => (open = false)} aria-label="Close menu" class="btn btn-ghost btn-sm">
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
                            class="block rounded-lg px-4 py-3 text-base hover:bg-base-200"
                            onclick={() => (open = false)}
                        >
                            Home
                        </a>
                    </li>
                </ul>

                <div class="mt-5 border-t border-base-200 pt-5">
                    {#if data.session}
                        <div class="flex flex-col gap-4 px-1">
                            <div class="flex items-center gap-3">
                                <img src={data.session.user.image ?? DefaultAvatar} alt="User Avatar" class="h-11 w-11 rounded-full"/>
                                <div class="text-base font-medium">
                                    {data.session?.user?.name}
                                </div>
                            </div>

                            <ul class="flex flex-col gap-2">
                                <li>
                                    <button onclick={() => signOut()} aria-label="Logout" title="Logout" role="menuitem" class="text-red-500 block px-4 py-3 rounded-lg hover:bg-base-200 w-full text-left text-base">
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    {:else}
                        <div class="px-1">
                            <button class="inline-block px-4 py-3 btn btn-primary btn-lg w-full text-center" onclick={() => signIn()}>
                                Login
                            </button>
                        </div>
                    {/if}
                </div>
            </nav>
        </div>
    </div>
</div>
