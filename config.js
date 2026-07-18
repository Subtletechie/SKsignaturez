// Sanity project identifiers — public by design (read-only client fetches
// require these in the browser bundle). Actual access control is enforced
// by Sanity's CORS origin allow-list and dataset visibility, not secrecy
// of these values. Fill these in after running `sanity init` in /studio.
window.SANITY_CONFIG = {
  projectId: 'bwaoqsr5',
  dataset: 'production',
  apiVersion: '2024-01-01',
};
