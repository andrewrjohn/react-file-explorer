"use client";
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderInputIcon,
  SaveIcon,
} from "lucide-react";

import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useRef, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import mime from "mime";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { getLanguageSupportExtension } from "@/lib/file-extensions-language-support";

const BLACKLIST = ["node_modules", "vendor"];

interface TreeNode {
  name: string;
  fullPath: string;
  mimeType?: string;
  kind: "directory" | "file";
  handle?: FileSystemFileHandle;
  children: TreeNode[];
}

interface SelectedFile {
  name: string;
  fullPath: string;
  type: string;
  content: string;
  handle: FileSystemFileHandle;
  /** bytes */
  size: number;
}

export function FileExplorer() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [rootDir, setRootDir] = useState("");

  const openPicker = async () => {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });

    const traverse = async (
      handle: FileSystemDirectoryHandle,
      parentDir: string
    ) => {
      const children: TreeNode[] = [];

      for await (const [name, entry] of handle.entries()) {
        const fullPath = `${parentDir}/${name}`;

        const mimeType = mime.getType(name) ?? "unknown";

        if (entry.kind === "file") {
          children.push({
            name,
            kind: "file",
            children: [],
            handle: entry,
            fullPath,
            mimeType,
          });
        }

        if (entry.kind === "directory") {
          if (!BLACKLIST.includes(name)) {
            const newHandle = await handle.getDirectoryHandle(name);

            const newChildren = await traverse(newHandle, fullPath);

            children.push({
              name,
              kind: "directory",
              children: newChildren,
              fullPath,
            });
          }
        }
      }

      return children;
    };

    const tree = await traverse(handle, handle.name);

    setTree(tree);
    setRootDir(handle.name);
    setSelectedFile(null);
  };

  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(selectedFile?.content ?? "");
  }, [selectedFile]);

  const selectedFileExtension =
    selectedFile?.name.split(".")[selectedFile?.name.split(".").length - 1] ||
    "";
  return (
    <div className="flex w-full">
      <CommandMenu tree={tree} setSelectedFile={setSelectedFile} />
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>File Explorer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible className="group/parent" defaultOpen>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="gap-0.5 cursor-pointer"
                        onClick={(e) => {
                          if (!rootDir) {
                            e.preventDefault();
                            openPicker();
                          }
                        }}
                      >
                        <ChevronRightIcon className="size-4 group-data-[state=open]/parent:rotate-90 transition-transform" />
                        <span>{rootDir || <em>Select folder...</em>}</span>
                        {/* <SidebarMenuBadge>{item.children.length}</SidebarMenuBadge> */}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <RecursiveMenu
                          tree={tree}
                          setSelectedFile={setSelectedFile}
                          selectedFile={selectedFile}
                        />
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton onClick={openPicker}>
            <FolderInputIcon />
            <em>Select folder...</em>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <form
        onSubmit={async (e) => {
          if (!selectedFile) return;

          e.preventDefault();

          const writable = await selectedFile.handle.createWritable();
          await writable.write(content);
          await writable.close();
          toast({ description: "Saved" });
        }}
        className="flex flex-col p-4 w-full flex-1"
      >
        <div className="flex items-center justify-between mb-2 pb-2">
          <SidebarTrigger type="button" />
          <FilePath path={selectedFile?.fullPath} />
          <Button disabled={!selectedFile} type="submit">
            Save <SaveIcon />
          </Button>
        </div>

        <div className="flex-1">
          <CodeMirror
            className="font-mono text-sm w-full whitespace-pre-wrap border-border rounded-sm flex-1 focus:outline-none"
            spellCheck={false}
            theme={vscodeDark}
            extensions={[
              ...(getLanguageSupportExtension(selectedFileExtension) ?? []),
              EditorView.lineWrapping,
              // EditorView.editable,
            ]}
            value={content}
            onChange={(v) => setContent(v)}
          />
        </div>
      </form>
    </div>
  );
}

function RecursiveMenu({
  tree,
  level = 1,
  selectedFile,
  setSelectedFile,
}: {
  tree: TreeNode[];
  level?: number;
  selectedFile: SelectedFile | null;
  setSelectedFile: (file: SelectedFile) => void;
}) {
  return tree.map((item, i) =>
    item.name.startsWith(".") ? null : item.kind === "file" ? (
      <SidebarMenuSubItem key={i}>
        <SidebarMenuSubButton
          className="cursor-pointer"
          isActive={selectedFile?.fullPath === item.fullPath}
          onClick={async () => {
            if (!item.handle) return;
            const file = await item.handle.getFile();
            const content = await file.text();

            if (content) {
              setSelectedFile({
                content,
                fullPath: item.fullPath,
                name: item.name,
                type: "",
                size: file.size,
                handle: item.handle,
              });
            }
          }}
        >
          <FileIcon /> <span>{item.name}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ) : (
      <Collapsible key={i} className="group/children">
        <SidebarMenuSubItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton className="gap-0.5 cursor-pointer relative overflow-visible -ml-[1.15rem]">
              {/* <div
                className="absolute inset-y-0 flex items-center left-0 -ml-2"
                style={{ transform: "translateZ(10px)" }}
              > */}
              <ChevronRightIcon className="size-4 group-data-[state=open]/children:rotate-90 transition-transform" />
              <FolderIcon className="mr-2" />
              {/* </div> */}
              <span>{item.name}</span>
              {/* <SidebarMenuBadge>{item.children.length}</SidebarMenuBadge> */}
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <RecursiveMenu
                tree={item.children}
                setSelectedFile={setSelectedFile}
                selectedFile={selectedFile}
                level={level + 1}
              />
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuSubItem>
      </Collapsible>
    )
  );
}

function FilePath({ path }: { path: string | undefined }) {
  const parts = path?.split("/");

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {!parts ? (
        <em>No file selected</em>
      ) : (
        parts.map((part, i) => (
          <div
            key={i}
            className={cn("flex items-center", {
              "text-foreground": i === parts.length - 1,
            })}
          >
            {part}{" "}
            {i !== parts.length - 1 && <ChevronRightIcon className="size-5" />}
          </div>
        ))
      )}
    </div>
  );
}

function CommandMenu({
  tree,
  setSelectedFile,
}: {
  tree: TreeNode[];
  setSelectedFile: (file: SelectedFile) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  let items: TreeNode[] = [];

  const flatten = (arr: TreeNode[]) => {
    for (const item of arr) {
      if (item.kind === "file" && !item.name.startsWith(".")) {
        items.push(item);
      } else if (!item.name.startsWith(".")) {
        flatten(item.children);
      }
    }
  };

  flatten(tree);

  const listRef = useRef<HTMLDivElement>(null);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Open file..."
        onValueChange={() => listRef.current?.scrollTo({ top: 0 })}
      />
      <CommandList ref={listRef}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Files" ref={listRef}>
          {items
            .filter((item) => item.kind === "file")
            .map((item, i) => (
              <CommandItem
                key={i}
                value={item.fullPath}
                keywords={[item.name]}
                onSelect={async () => {
                  if (!item.handle) return;
                  const file = await item.handle.getFile();
                  const content = await file.text();

                  if (content) {
                    setSelectedFile({
                      content,
                      fullPath: item.fullPath,
                      name: item.name,
                      type: "",
                      size: file.size,
                      handle: item.handle,
                    });
                  }

                  setOpen(false);
                }}
              >
                {item.fullPath
                  .split("/")
                  .map((item, i) =>
                    i !== 0 ? `${i !== 1 ? "/" : ""}${item}` : null
                  )}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
