// ============================================================
// PERSUAXION SDK — ENTRY POINT
// Wires identity, context, transport, and all detectors.
//
// Usage (Shopify ScriptTag):
//   Persuaxion.init({ shopDomain: 'example.myshopify.com' });
//
// No side effects on script load. Only runs when init() is called.
// ============================================================

import { resolveIdentity } from './core/identity.js';
import { resolveContext  } from './core/context.js';
import {
  configure,
  send         as transportSend,
  sendBeacon   as transportSendBeacon,
} from './core/transport.js';

import { attachClickDetector          } from './detectors/click.js';
import { attachScrollDetector         } from './detectors/scroll.js';
import { attachModalDetector          } from './detectors/modal.js';
import { attachVariantDetector        } from './detectors/variant.js';
import { attachExitDetector           } from './detectors/exit.js';
import { attachAddToCartDetector      } from './detectors/addtocart.js';
import { fireProductViewIfApplicable  } from './detectors/pageview.js';

// ── INIT ──────────────────────────────────────────────────────

function init({ shopDomain, apiEndpoint }) {
  const API_ENDPOINT = apiEndpoint || 'https://api.persuaxion.app/api/events';
  const identity = resolveIdentity();
  const ctx      = resolveContext();

  // Shared mutable state — variantId is the only field detectors write to.
  // All other fields are read-only after init.
  const state = {
    anonymousUserId: identity.anonymousUserId,
    sessionId:       identity.sessionId,
    customerId:      identity.customerId,
    isNewUser:       identity.isNewUser,
    isRevisit:       identity.isRevisit,
    shopDomain:      shopDomain || ctx.shopDomain,
    pageType:        ctx.pageType,
    productId:       ctx.productId,
    variantId:       ctx.variantId, // variant detector mutates this in-place
  };

  configure(API_ENDPOINT);

  // Builds the full backend payload from live state + detector-supplied event fields.
  // variantId is read at call time so it always reflects the user's current selection.
  function buildPayload(eventData) {
    return {
      anonymous_user_id: state.anonymousUserId,
      session_id:        state.sessionId,
      shopify_customer_id: state.customerId,
      shop_domain:       state.shopDomain,
      page_type:         state.pageType,
      product_id:        state.productId,
      variant_id:        state.variantId,
      is_new_user:       state.isNewUser,
      is_revisit:        state.isRevisit,
      event_type:        eventData.event_type,
      element_text:      eventData.element_text  ?? null,
      element_type:      eventData.element_type  ?? null,
      metadata:          eventData.metadata       ?? {},
      timestamp:         new Date().toISOString(),
    };
  }

  function send(eventData) {
    transportSend(buildPayload(eventData));
  }

  function sendBeacon(eventData) {
    transportSendBeacon(buildPayload(eventData));
  }

  // ── ONE-SHOT EVENTS (fired immediately at init, no DOM listeners) ──

  // Fire product_view for every product page load. Gives the backend
  // a baseline entry event even for zero-interaction sessions.
  fireProductViewIfApplicable(state, send);

  // Fire revisit signal if this is a returning user opening a new session
  // (e.g. came back in a new tab). identity.js detects this correctly;
  // without this send() the REVISIT signal in the mapper never triggers.
  if (state.isRevisit) {
    send({ event_type: 'revisit', element_text: null, element_type: null, metadata: {} });
  }

  // ── DOM DETECTORS (attach listeners, fire on user action) ────────
  // Order does not matter — each attaches its own independent listeners.
  attachClickDetector(state, send);
  attachScrollDetector(state, send);
  attachModalDetector(state, send);
  attachVariantDetector(state, send);  // mutates state.variantId
  attachExitDetector(state, sendBeacon);
  attachAddToCartDetector(state, send);
}

// ── EXPORT ────────────────────────────────────────────────────
// Rollup IIFE with name:'Persuaxion' maps this to window.Persuaxion = { init }.
// No manual window assignment needed.
export { init };
