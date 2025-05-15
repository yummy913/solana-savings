import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Manrope:wght@200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Coin({ Name, Ticker, Amount, Image }) {
  return /* @__PURE__ */ jsxs("div", { className: "Home-Content-Info-Coins-Coin", children: [
    /* @__PURE__ */ jsx("img", { className: "Home-Content-Info-Coins-Coin-Image", src: Image }),
    /* @__PURE__ */ jsxs("div", { className: "coin-info-vertical", children: [
      /* @__PURE__ */ jsxs("span", { className: "Home-Content-Info-Coins-Coin-Ticker", children: [
        "$",
        Ticker
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "coin-info-bottom", children: [
        /* @__PURE__ */ jsxs("span", { className: "Home-Content-Info-Coins-Coin-Name", children: [
          "Name: ",
          Name
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "Home-Content-Info-Coins-Coin-Amount", children: [
          "Amount: ",
          Amount
        ] })
      ] })
    ] })
  ] });
}
function meta({}) {
  return [{
    title: "Solana Savings"
  }, {
    name: "description",
    content: ""
  }];
}
const home = withComponentProps(function Home() {
  const [wallet, setWallet] = useState("");
  const [accountInfo, setAccountInfo] = useState(null);
  const [solPrice, setSolPrice] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadedItemsCount, setLoadedItemsCount] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    getSolPrice();
  }, []);
  useEffect(() => {
    console.log(accountInfo);
  }, [accountInfo]);
  async function getSolPrice() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
    const data = await response.json();
    setSolPrice(data.solana.usd);
  }
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function fetchTokenInfoWithRetry(tokenAddress, maxRetries = 3) {
    let retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        await delay(150 * Math.pow(2, retryCount));
        const tokenRes = await fetch("https://zkcomp-viewer-production.up.railway.app/api/tokenInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            tokenAddress
          })
        });
        if (tokenRes.ok) {
          return await tokenRes.json();
        }
        throw new Error("Failed to fetch token info");
      } catch (e) {
        retryCount++;
        if (retryCount === maxRetries) {
          throw e;
        }
      }
    }
  }
  async function loadMoreItems() {
    var _a;
    if (!accountInfo || loadingMore) return;
    setLoadingMore(true);
    const newItems = [...accountInfo.items];
    const startIndex = loadedItemsCount;
    const endIndex = Math.min(startIndex + 9, newItems.length);
    for (let i = startIndex; i < endIndex; i++) {
      const item = newItems[i];
      if ((_a = item.tokenData) == null ? void 0 : _a.mint) {
        try {
          const tokenData = await fetchTokenInfoWithRetry(item.tokenData.mint);
          newItems[i] = {
            ...item,
            tokenInfo: tokenData
          };
          setAccountInfo((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              items: newItems
            };
          });
        } catch (e) {
          console.error(`Error fetching tokenInfo for ${item.tokenData.mint}`, e);
        }
      }
    }
    setLoadedItemsCount(endIndex);
    setLoadingMore(false);
  }
  async function getAccountInfo(walletAddress) {
    var _a, _b, _c;
    const payload = {
      walletAddress
    };
    setLoading(true);
    setError("");
    setLoadedItemsCount(9);
    try {
      const response = await fetch("https://zkcomp-viewer-production.up.railway.app/api/getAccountInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.error || "Unknown error"}`);
      }
      const data = await response.json();
      const items = ((_b = (_a = data.result) == null ? void 0 : _a.value) == null ? void 0 : _b.items) || [];
      const numAssets = items.length;
      const COMPRESSED_SIZE_PER_ASSET = 40;
      const UNCOMPRESSED_SIZE_PER_ASSET = 926;
      const compressedBytes = numAssets * COMPRESSED_SIZE_PER_ASSET + (numAssets ? 128 : 0);
      const compressedCostlamports = numAssets * COMPRESSED_SIZE_PER_ASSET * 3480 * 2;
      const uncompressedBytes = numAssets * (UNCOMPRESSED_SIZE_PER_ASSET + 128);
      const uncompressedCostlamports = numAssets * UNCOMPRESSED_SIZE_PER_ASSET * 3480 * 2;
      const result = {
        address: walletAddress,
        numAssets,
        compressedBytes,
        compressedCost: compressedCostlamports / 1e9,
        uncompressedBytes,
        uncompressedCost: uncompressedCostlamports / 1e9,
        savings: (uncompressedCostlamports - compressedCostlamports) / 1e9,
        items: items.map((item) => ({
          ...item
        }))
      };
      setAccountInfo(result);
      const newItems = [...items];
      for (let i = 0; i < Math.min(9, newItems.length); i++) {
        const item = newItems[i];
        if ((_c = item.tokenData) == null ? void 0 : _c.mint) {
          try {
            const tokenData = await fetchTokenInfoWithRetry(item.tokenData.mint);
            newItems[i] = {
              ...item,
              tokenInfo: tokenData
            };
            setAccountInfo((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                items: newItems
              };
            });
          } catch (e) {
            console.error(`Error fetching tokenInfo for ${item.tokenData.mint}`, e);
          }
        }
      }
    } catch (error2) {
      setError(error2.message || "Failed to fetch account info.");
    } finally {
      setLoading(false);
    }
  }
  const handleSubmit = () => {
    if (wallet.trim() && !loading) {
      getAccountInfo(wallet.trim());
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "Home",
    children: [/* @__PURE__ */ jsx("div", {
      className: "Home-Header",
      children: /* @__PURE__ */ jsx("span", {
        className: "Home-Header-Name",
        children: "solsavings"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "Home-Content",
      children: [/* @__PURE__ */ jsx("span", {
        className: "Home-Content-Title",
        children: "Compression Profiler"
      }), /* @__PURE__ */ jsx("span", {
        className: "Home-Content-Desc",
        children: "Discover how much you're saving with ZK Compression on Solana"
      }), /* @__PURE__ */ jsx("span", {
        className: "Home-Content-Amount",
        children: accountInfo != null && solPrice ? `${accountInfo.savings.toFixed(4)} SOL, $${(solPrice * accountInfo.savings).toFixed(3)}` : "0 SOL, $0"
      }), /* @__PURE__ */ jsxs("div", {
        className: "Home-Content-Input",
        children: [/* @__PURE__ */ jsx("input", {
          className: "Home-Content-Input-Text",
          placeholder: "Enter Solana Wallet Address",
          value: wallet,
          onChange: (e) => setWallet(e.target.value),
          onKeyPress: handleKeyPress
        }), /* @__PURE__ */ jsx("button", {
          className: "Home-Content-Input-Button",
          onClick: handleSubmit,
          disabled: loading || !wallet.trim(),
          children: loading ? "Loading..." : "Submit"
        })]
      }), accountInfo && /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "Home-Content-Info",
          children: [loading && /* @__PURE__ */ jsx("span", {
            children: "Loading..."
          }), error && /* @__PURE__ */ jsx("span", {
            style: {
              color: "red"
            },
            children: error
          }), /* @__PURE__ */ jsxs("span", {
            className: "Home-Content-Info-Address",
            children: ["Number of Assets: ", accountInfo.numAssets]
          }), /* @__PURE__ */ jsxs("span", {
            className: "Home-Content-Info-Assets",
            children: ["Compressed Bytes: ", accountInfo.compressedBytes]
          }), /* @__PURE__ */ jsxs("span", {
            className: "Home-Content-Info-CBytes",
            children: ["Uncompressed Bytes: ", accountInfo.uncompressedBytes]
          }), /* @__PURE__ */ jsxs("span", {
            className: "Home-Content-Info-Bytes",
            children: ["Compressed Cost: ", accountInfo.compressedCost.toFixed(4), " SOL"]
          }), /* @__PURE__ */ jsxs("span", {
            className: "Home-Content-Info-CCost",
            children: ["Uncompressed Cost: ", accountInfo.uncompressedCost.toFixed(4), " SOL"]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "Home-Content-Info-Coins",
          children: accountInfo.items.slice(0, loadedItemsCount).map((item, index) => {
            const {
              tokenInfo,
              tokenData
            } = item;
            if (!tokenInfo) return null;
            return /* @__PURE__ */ jsx(Coin, {
              Image: tokenInfo.imageUri,
              Name: tokenInfo.name,
              Ticker: tokenInfo.ticker,
              Amount: (tokenData.amount / Math.pow(10, tokenInfo.decimals || 0)).toLocaleString(void 0, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 6
              })
            }, index);
          })
        }), accountInfo && loadedItemsCount < accountInfo.items.length && /* @__PURE__ */ jsx("button", {
          className: "Home-Content-LoadMore",
          onClick: loadMoreItems,
          disabled: loadingMore,
          children: loadingMore ? "Loading..." : "Load More"
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "Home-Footer",
      children: /* @__PURE__ */ jsx("span", {
        className: "Home-Footer-Text",
        children: "Built by NAB Labs"
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-SQZkSKxz.js", "imports": ["/assets/chunk-D4RADZKF-BXVSF3ox.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BqwMVuxT.js", "imports": ["/assets/chunk-D4RADZKF-BXVSF3ox.js", "/assets/with-props-BMOtgW5C.js"], "css": ["/assets/root-BeTWbhFS.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DVDy6krO.js", "imports": ["/assets/with-props-BMOtgW5C.js", "/assets/chunk-D4RADZKF-BXVSF3ox.js"], "css": ["/assets/home-DwH8Uu-n.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-37d471cd.js", "version": "37d471cd", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
