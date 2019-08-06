export const copyStringToClipboard = string => {
  // Create new element
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = string;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
};
