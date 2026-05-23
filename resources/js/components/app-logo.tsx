export default function AppLogo() {
    return (
        <>
            <img
                src="/assets/logo.png"
                alt="PC Handover"
                className="size-9 shrink-0 object-contain"
            />
            <div className="ml-2 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="truncate leading-tight font-semibold text-sidebar-foreground">
                    PC Handover
                </span>
            </div>
        </>
    );
}
