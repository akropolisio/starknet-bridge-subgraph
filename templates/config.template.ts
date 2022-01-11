export const bridgesAddresses = [
  "{{modules.ethBridge}}",
  {{#modules.tokenBridges}}
  "{{bridge}}",
  {{/modules.tokenBridges}}
];
