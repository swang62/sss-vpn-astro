import {
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from "@/components/ui/toc";

function TableOfContents() {
  return (
    <div className="mx-auto lg:fixed lg:top-24 lg:left-12 lg:mx-0 xl:left-32 2xl:left-64">
      <TableOfContentsList>
        <TableOfContentsTitle>Table of Contents</TableOfContentsTitle>
        <TableOfContentsItem>
          <TableOfContentsLink href="#configuration">Overview</TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem indent>
          <TableOfContentsLink href="#proxies">Proxies</TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem indent>
          <TableOfContentsLink href="#options">Config options</TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem indent>
          <TableOfContentsLink href="#updates">App updates</TableOfContentsLink>
        </TableOfContentsItem>

        <TableOfContentsItem>
          <TableOfContentsLink href="#mobile">Mobile-only tips</TableOfContentsLink>
        </TableOfContentsItem>
      </TableOfContentsList>
    </div>
  );
}

export default TableOfContents;
