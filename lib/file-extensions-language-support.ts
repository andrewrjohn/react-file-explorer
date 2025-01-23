import { langs } from "@uiw/codemirror-extensions-langs";

export function getLanguageSupportExtension(fileExtension: string) {
  return EXTENSIONS[fileExtension];
}

const EXTENSIONS: Record<string, any> = {
  jsx: [langs.javascript({ jsx: true, typescript: true })],
  tsx: [langs.javascript({ jsx: true, typescript: true })],
  ts: [langs.javascript({ jsx: true, typescript: true })],
  js: [langs.javascript({ jsx: true, typescript: true })],
  mjs: [langs.javascript({ jsx: true, typescript: true })],
  cjs: [langs.javascript({ jsx: true, typescript: true })],
  cts: [langs.javascript({ jsx: true, typescript: true })],
  mts: [langs.javascript({ jsx: true, typescript: true })],
  md: [langs.markdown()],
  json: [langs.json()],
  html: [langs.html()],
  rs: [langs.rust()],
  apl: [langs.apl()],
  c: [langs.c()],
  cs: [langs.csharp()],
  scala: [langs.scala()],
  sol: [langs.solidity()],
  kt: [langs.kotlin()],
  glsl: [langs.shader()],
  m: [langs.objectiveC()],
  mm: [langs.objectiveCpp()],
  nut: [langs.squirrel()],
  ceylon: [langs.ceylon()],
  dart: [langs.dart()],
  cmake: [langs.cmake()],
  cob: [langs.cobol()],
  lisp: [langs.commonLisp()],
  cr: [langs.crystal()],
  cypher: [langs.cypher()],
  d: [langs.d()],
  diff: [langs.diff()],
  dtd: [langs.dtd()],
  dylan: [langs.dylan()],
  ebnf: [langs.ebnf()],
  ecl: [langs.ecl()],
  e: [langs.eiffel()],
  elm: [langs.elm()],
  factor: [langs.factor()],
  fcl: [langs.fcl()],
  forth: [langs.forth()],
  f: [langs.fortran()],
  s: [langs.gas()],
  feature: [langs.gherkin()],
  groovy: [langs.groovy()],
  hs: [langs.haskell()],
  hx: [langs.haxe()],
  http: [langs.http()],
  idl: [langs.idl()],
  j2: [langs.jinja2()],
  nb: [langs.mathematica()],
  mbox: [langs.mbox()],
  mrc: [langs.mirc()],
  mo: [langs.modelica()],
  mscgen: [langs.mscgen()],
  mum: [langs.mumps()],
  nsi: [langs.nsis()],
  nt: [langs.ntriples()],
  oz: [langs.oz()],
  pig: [langs.pig()],
  properties: [langs.properties()],
  proto: [langs.protobuf()],
  pp: [langs.puppet()],
  q: [langs.q()],
  sas: [langs.sas()],
  sass: [langs.sass()],
  liquid: [langs.liquid()],
  mmd: [langs.mermaid()],
  nix: [langs.nix()],
  svelte: [langs.svelte()],
  sieve: [langs.sieve()],
  st: [langs.smalltalk()],
  solr: [langs.solr()],
  sparql: [langs.sparql()],
  stex: [langs.stex()],
  textile: [langs.textile()],
  wiki: [langs.tiddlyWiki()],
  tiki: [langs.tiki()],
  roff: [langs.troff()],
  ttcn: [langs.ttcn()],
  turtle: [langs.turtle()],
  vm: [langs.velocity()],
  v: [langs.verilog()],
  vhdl: [langs.vhdl()],
  webidl: [langs.webIDL()],
  xquery: [langs.xQuery()],
  ys: [langs.yacas()],
  z80: [langs.z80()],
  wat: [langs.wast()],
  vue: [langs.vue()],
  ng: [langs.angular()],
  css: [langs.css()],
  py: [langs.python()],
  xml: [langs.xml()],
  sql: [langs.sql()],
  mysql: [langs.mysql()],
  pgsql: [langs.pgsql()],
  java: [langs.java()],
  cpp: [langs.cpp()],
  php: [langs.php()],
  go: [langs.go()],
  sh: [langs.shell()],
  lua: [langs.lua()],
  swift: [langs.swift()],
  tcl: [langs.tcl()],
  yml: [langs.yaml()],
  yaml: [langs.yaml()],
  vb: [langs.vb()],
  ps1: [langs.powershell()],
  bf: [langs.brainfuck()],
  styl: [langs.stylus()],
  erl: [langs.erlang()],
  nginx: [langs.nginx()],
  pl: [langs.perl()],
  rb: [langs.ruby()],
  pas: [langs.pascal()],
  ls: [langs.livescript()],
  less: [langs.less()],
  scm: [langs.scheme()],
  toml: [langs.toml()],
  vbs: [langs.vbscript()],
  clj: [langs.clojure()],
  coffee: [langs.coffeescript()],
  jl: [langs.julia()],
  dockerfile: [langs.dockerfile()],
  r: [langs.r()],
};
