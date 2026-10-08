"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
  OFFICIAL_STUDY_TOPIC_IDS,
  QUIZ_BLUEPRINT,
  STUDY_TOPICS,
  buildBalancedQuiz,
  buildCustomQuiz,
  questions,
  calculateIpv4Fragments,
  countBy,
  intToIp,
  ipToInt,
  networkInfo,
  prefixToMask,
  validateCustomQuiz,
  validateQuestionBank,
  validateQuiz
} = require("./app-20261008.js");


assert.equal(
  fs.readFileSync("app.js", "utf8"),
  fs.readFileSync("app-20261008.js", "utf8"),
  "O JavaScript versionado do navegador deve corresponder ao arquivo-fonte."
);
assert.equal(
  fs.readFileSync("styles.css", "utf8"),
  fs.readFileSync("styles-20261008.css", "utf8"),
  "O CSS versionado do navegador deve corresponder ao arquivo-fonte."
);


const report = validateQuestionBank({ simulationRuns: 1000, log: false });

assert.equal(report.valid, true, report.errors.join("\n"));
assert.ok(questions.length >= 300, "O banco deve possuir ao menos 300 questões.");
assert.equal(QUIZ_BLUEPRINT.reduce((sum, item) => sum + item.count, 0), 30);
assert.ok(questions.filter(question => question.source === "moodle_ipv6_parte_1").length >= 1);
assert.ok(questions.filter(question => question.source === "moodle_ipv6_parte_2").length >= 1);
assert.ok(
  questions.filter(question => question.source.startsWith("moodle_ipv6_parte_")).length >= 50,
  "O banco deve ter ao menos 50 questões baseadas nos questionários Moodle de IPv6."
);

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


function testCustomSelection(name, topicIds, runs = 100) {
  for (let run = 0; run < runs; run += 1) {
    const order = buildCustomQuiz(topicIds);
    const errors = validateCustomQuiz(order, topicIds);
    assert.deepEqual(errors, [], `${name}, simulado ${run + 1}: ${errors.join("; ")}`);
  }
}


testCustomSelection("somente NDP", ["ipv6_ndp"]);
testCustomSelection("somente Subnetting", ["subnetting"]);
testCustomSelection(
  "IPv6 completo",
  STUDY_TOPICS.filter(topic => topic.id.startsWith("ipv6_")).map(topic => topic.id)
);
testCustomSelection("NDP + SLAAC + DHCPv6", ["ipv6_ndp", "ipv6_slaac_dhcp"]);

let previousOfficial = [];
for (let run = 0; run < 100; run += 1) {
  const order = buildBalancedQuiz(previousOfficial, 3);
  assert.deepEqual(validateQuiz(order), [], `oficial, simulado ${run + 1}`);
  assert.ok(order.every(index => OFFICIAL_STUDY_TOPIC_IDS.includes(questions[index].studyTopic)));
  previousOfficial = order;
}

console.log("1500 simulados validados com sucesso (1000 do banco + 500 cenários de filtro). ");
console.log(`Banco final: ${questions.length} questões (${revised.length} adicionadas na revisão anterior).`);
console.log("Por tema selecionável:", countBy(questions, "studyTopic"));
console.log("Por fonte:", countBy(questions, "source"));
