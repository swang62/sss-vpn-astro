import {
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from "./ui/toc";

function TipsTableOfContents() {
  return (
    <div className="mx-auto lg:mx-0 lg:fixed lg:top-24 lg:left-12 xl:left-32 2xl:left-64">

      <TableOfContentsList>
        <TableOfContentsTitle>Table of Contents</TableOfContentsTitle>
        <TableOfContentsItem>
          <TableOfContentsLink href="#configuration">
            Configuration
          </TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem indent>
          <TableOfContentsLink href="#proxies">
            Proxies
          </TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem indent>
          <TableOfContentsLink href="#options">
            Options
          </TableOfContentsLink>
        </TableOfContentsItem>
        <TableOfContentsItem indent>
          <TableOfContentsLink href="#updates">
            Updates
          </TableOfContentsLink>
        </TableOfContentsItem>

        <TableOfContentsItem>
          <TableOfContentsLink href="#mobile">
            Mobile / 5G Tips
          </TableOfContentsLink>
        </TableOfContentsItem>
      </TableOfContentsList>
    </div>
  );
}

export default TipsTableOfContents;
