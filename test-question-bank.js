"use strict";

const assert = require("node:assert/strict");
const {
  QUIZ_BLUEPRINT,
  questions,
  calculateIpv4Fragments,
  countBy,
  intToIp,
  ipToInt,
  networkInfo,
  prefixToMask,
  validateQuestionBank
} = require("./app.js");


const report = validateQuestionBank({ simulationRuns: 1000, log: false });

assert.equal(report.valid, true, report.errors.join("\n"));
assert.ok(questions.length >= 300, "O banco deve possuir ao menos 300 questões.");
assert.equal(QUIZ_BLUEPRINT.reduce((sum, item) => sum + item.count, 0), 30);

const revised = questions.filter(question => question.source === "revisao_2026");
const revisedBySubtopic = countBy(revised, "subtopic");

assert.ok(revised.length >= 60);
assert.ok(revisedBySubtopic.fragmentacao_ipv4 >= 10);
assert.ok(
  revisedBySubtopic.gateway_subredes + revisedBySubtopic.roteamento_estatico_tabelas >= 10
);
assert.ok(revisedBySubtopic.distribuicao_enderecos >= 8);
assert.ok(revisedBySubtopic.tipos_ipv4 + revisedBySubtopic.ipv4_privado >= 8);
assert.ok(revisedBySubtopic.porta_saida >= 6);
assert.ok(revisedBySubtopic.atribuicao_ipv6 >= 8);
assert.ok(revisedBySubtopic.vlan_intervlan >= 5);
assert.ok(revisedBySubtopic.ping_traceroute >= 5);

assert.equal(intToIp(ipToInt("203.0.113.77")), "203.0.113.77");
assert.equal(prefixToMask(26), "255.255.255.192");

const subnet = networkInfo("192.168.77.91", 26);
assert.equal(intToIp(subnet.network), "192.168.77.64");
assert.equal(intToIp(subnet.broadcast), "192.168.77.127");
assert.equal(intToIp(subnet.first), "192.168.77.65");
assert.equal(intToIp(subnet.last), "192.168.77.126");
assert.equal(subnet.usable, 62);

const fragmentation = calculateIpv4Fragments(4000, 1500, 20);
assert.equal(fragmentation.maxData, 1480);
assert.deepEqual(fragmentation.fragments, [
  { dataLength: 1480, totalLength: 1500, offset: 0, mf: 1 },
  { dataLength: 1480, totalLength: 1500, offset: 185, mf: 1 },
  { dataLength: 1020, totalLength: 1040, offset: 370, mf: 0 }
]);

console.log("1000 simulados validados com sucesso.");
console.log(`Banco final: ${questions.length} questões (${revised.length} adicionadas nesta revisão).`);
