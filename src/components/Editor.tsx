import { VFC, useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import styles from "./Editor.module.css";

export const Editor: VFC = () => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        const createdEditor = monaco.editor.create(monacoEl.current!, {
          value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
            "\n"
          ),
          language: "typescript",
        });

        const contentWidget = {
          getId: function () {
            return "my.content.widget";
          },
          getDomNode: function () {
            const domNode = document.createElement("div");
            domNode.innerHTML = "My content widget";
            domNode.style.background = "grey";
            domNode.style.opacity = "0.6";
            domNode.style.width = "500px";
            domNode.style.height = `${50}px`;
            domNode.hidden = true;
            return domNode;
          },
          getPosition: function (): monaco.editor.IContentWidgetPosition {
            return {
              position: {
                lineNumber: 1,
                column: 20,
              },
              range: {
                startLineNumber: 1,
                startColumn: 10,
                endLineNumber: 3,
                endColumn: 10,
              },
              preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
            };
          },
        };
        createdEditor.addContentWidget(contentWidget);

        return createdEditor;
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return <div className={styles.Editor} ref={monacoEl}></div>;
};
