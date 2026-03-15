import {
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
} from "@/components/ui/toc";

function TableOfContents() {
  return (
    <div className="mx-auto text-center lg:fixed lg:top-24 lg:left-12 lg:mx-0 lg:text-right xl:left-32 2xl:left-64">
      <TableOfContentsList>
        <TableOfContentsItem>
          <TableOfContentsLink href="#configuration">
            Overview
          </TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem>
          <TableOfContentsLink href="#proxies">
            Selecting proxies
          </TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem>
          <TableOfContentsLink href="#options">
            DNS settings
          </TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem>
          <TableOfContentsLink href="#updates">App updates</TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem>
          <TableOfContentsLink href="#mobile">Mobile tips</TableOfContentsLink>
        </TableOfContentsItem>
      </TableOfContentsList>
    </div>
  );
}

export default TableOfContents;
