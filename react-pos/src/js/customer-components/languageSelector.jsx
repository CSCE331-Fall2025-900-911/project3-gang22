import { useEffect, useRef, useState } from "react";
import { translateBatch } from "../customer-pages/menu.jsx";

export default function LanguageTranslator() {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const availableLanguages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" }
  ];

  const originalTextMap = useRef(new WeakMap());
  const observerRef = useRef(null);

  // ✅ Persist language
  useEffect(() => {
    localStorage.setItem("lang", currentLanguage);
  }, [currentLanguage]);

  // ✅ Core DOM translation logic (reusable)
  async function translateAllVisibleText() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

          if (
            node.parentElement.closest("[data-no-translate]") ||
            node.parentElement.closest("script, style, textarea, input, select, option")
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;

    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    if (textNodes.length === 0) return;

    // ✅ Restore English
    if (currentLanguage === "en") {
      textNodes.forEach((node) => {
        const original = originalTextMap.current.get(node);
        if (original) node.nodeValue = original;
      });
      return;
    }

    // ✅ Cache original text
    const originals = textNodes.map((node) => {
      if (!originalTextMap.current.has(node)) {
        originalTextMap.current.set(node, node.nodeValue);
      }
      return node.nodeValue;
    });

    try {
      const translated = await translateBatch(
        originals.map((t) => t.trim()),
        currentLanguage
      );

      textNodes.forEach((node, i) => {
        if (translated[i]) node.nodeValue = translated[i];
      });
    } catch (err) {
      console.error("Batch DOM translation failed:", err);
    }
  }

  // ✅ Run when language changes
  useEffect(() => {
    translateAllVisibleText();
  }, [currentLanguage]);

  // ✅ Observe for dynamically added content (menu, modals, etc.)
  useEffect(() => {
    observerRef.current = new MutationObserver(() => {
      if (currentLanguage !== "en") {
        translateAllVisibleText();
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observerRef.current?.disconnect();
  }, [currentLanguage]);

  return (
    <div className="language-selector" data-no-translate>
      <select
        value={currentLanguage}
        onChange={(e) => setCurrentLanguage(e.target.value)}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
