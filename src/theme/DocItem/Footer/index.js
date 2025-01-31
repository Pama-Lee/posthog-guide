import React from "react";
import Footer from "@theme-original/DocItem/Footer";
import Comments from "@site/src/components/Comments";
import { ColorModeProvider } from '@docusaurus/theme-common/internal';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <ColorModeProvider>
        <Comments />
      </ColorModeProvider>
    </>
  );
}
