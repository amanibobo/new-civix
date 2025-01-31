"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, HomeIcon, MenuIcon, Plus, PlusCircle, Search, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { useSearch } from "@/hooks/use-search";
import { Navbar } from "./navbar";
import { TrashBox } from "./trashbox";

export const Navigation = () => {

    const router = useRouter();
    const search = useSearch();
    const params = useParams();
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWitdth = event.clientX;

        if (newWitdth < 240) newWitdth = 240;
        if (newWitdth > 480) newWitdth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWitdth}px`;
            navbarRef.current.style.setProperty("left", `${newWitdth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWitdth}px)`);
        }
    };

        const handleMouseUp = () => {
            isResizingRef.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        const resetWidth = () => {
            if (sidebarRef.current && navbarRef.current) {
                setIsCollapsed(false);
                setIsResetting(true);

                sidebarRef.current.style.width = isMobile ? "100%" : "240px";
                navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
                navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
                setTimeout(() => setIsResetting(false), 300);
            }
        };

        const collapse = () => {
            if (sidebarRef.current && navbarRef.current) {
                setIsCollapsed(true);
                setIsResetting(true);

                sidebarRef.current.style.width = "0";
                navbarRef.current.style.setProperty("width", "100%");
                navbarRef.current.style.setProperty("left", "0");
                setTimeout(() => setIsResetting(false), 300);
            }
        }
    
        const handleCreate = () => {
            const promise = create({ title: "Untitled Space" })
                .then((documentId) => router.push(`/spaces/${documentId}`))

            toast.promise(promise, {
                loading: "Creating a new space...",
                success: "New space created!",
                error: "Failed to generate a new space."
            });
        };

        const Homer = () => {
            const homeyy =  router.push(`/spaces`);

            return homeyy;
        };

    return (
        <>
        <aside
            ref={sidebarRef}
            className={cn("group/sidebar h-screen bg-white dark:bg-muted border-r-[1px] overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "w-0"
            )}
        >
            <div
                onClick={collapse}
                role="button"
                className={cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover-bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100"
                )}
            >
                <ChevronsLeft className="h-6 w-6"/>
            </div>
            <div>
                
               <UserItem />
               <Item onClick={Homer} label="Home" icon={HomeIcon} butter={false} />
               <Item 
                label="Search"
                icon={Search}
                isSearch
                onClick={search.onOpen}
                butter={false}
               />
               <Item onClick={handleCreate} label="Add New" icon={PlusCircle} butter={false} />
            </div>
            <div>


            </div>
            <div className="mt-4">
            <span className="truncate text-gray-600 font-semibold dark:text-white pl-4">
            Code Spaces
            </span>
                <DocumentList />
                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item label="Trash" icon={Trash} />
                    </PopoverTrigger>
                    <PopoverContent 
                    className="p-0 w-72"
                    side={isMobile ? "bottom" : "right"}>
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>
            <div onMouseDown={handleMouseDown} onClick={resetWidth} className="opacity-0 group-hover/sidebar:opacity-100
            transition cursor-ew-resize absolute h-screen w-1 bg-primary/10
            right-0 top-0"/>  
        </aside>
        <div
            ref={navbarRef}
            className={cn(
                "absolute top-0 z-[99999] left-60 w[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
            )}
        >

            {!!params.documentId ? (
                <Navbar 
                    isCollapsed={isCollapsed}
                    onResetWidth={resetWidth}
                />
            ) : (
            <nav className="bg-transparent px-3 py-2 w-full">
                {isCollapsed && <MenuIcon role="button" onClick={resetWidth} className="h-6 w-6 text-muted-foreground" />}
            </nav>
            )}
        </div>
        </>
    )
}