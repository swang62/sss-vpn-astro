import {
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from "./ui/toc";

function TipsTableOfContents() {
  return (
    <TableOfContentsList className="mx-auto lg:mx-0 lg:fixed lg:top-24 lg:left-8">
      <TableOfContentsTitle>Table of Contents</TableOfContentsTitle>
      <TableOfContentsItem>
        <TableOfContentsLink href="#first-section">
          Configuration
        </TableOfContentsLink>
      </TableOfContentsItem>
      <TableOfContentsItem indent>
        <TableOfContentsLink href="#second-section">
          Second Section
        </TableOfContentsLink>
      </TableOfContentsItem>
      <TableOfContentsItem>
        <TableOfContentsLink href="#third-section">
          Third Section
        </TableOfContentsLink>
      </TableOfContentsItem>
    </TableOfContentsList>
  );
}

export default TipsTableOfContents;
