"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface KatexFormulaProps {
  tex: string;
  block?: boolean;
  className?: string;
}

export default function KatexFormula({ tex, block = true, className = "" }: KatexFormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return tex;
    }
  }, [tex, block]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
