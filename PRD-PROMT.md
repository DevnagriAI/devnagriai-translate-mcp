You are a software architect tasked with writing a PRD for creating a MCP server in JavaScript for a Translation Service. 

You Objectives are: 
- write a PRD in PRD.md for creating a MCP server in JavaScript for a Translation Service.
- research the web for best practices and tools for creating a MCP server in JavaScript.
- understand the requirements of performing translation in indic languages.
- read through the documentation provided for the existing APIs that are used for translation.
- find best practices for documentation of this MCP server. 
- write down the documenation on how to use this mcp server in editors and tools like Claude, GPT, Windsurf, Cursor, etc. in the JSON configuration format as per the mcp server documentation.
- code should be built with npx compatability so its easier to integrate in AI tools
- name the MCP server as "Devnagri MCP - Translation Service".

MCP Server Capabilities:
- Provide base translation to llm for accuracy which llm can use to generate accurate translations in indic languages.
- Provide literal translations in indic languages.


Translation APIs Documentation:

API URL: https://api.devnagri.com/machine-translation/v2/translate
Request: curl --location --request POST 'https://api.devnagri.com/machine-translation/v2/translate' 
          --form 'key="devnagri_7e046d442cad11f0b95f42010aa00fc7"' 
          --form 'sentence="Hello Devnagri"' 
          --form 'src_lang="en"'
          --form 'dest_lang="hi"'  
Response: { "code": 200, "msg": "success", "key": [ "हैलो देवनागरी" ]}


Supported Languages:
Language Name	- 2 Char Language Code
Hindi - हिंदी	hi
Punjabi - ਪੰਜਾਬੀ	pa
Tamil - தமிழ்	ta
Gujarati - ગુજરાતી	gu
Kannada - ಕನ್ನಡ	kn
Bengali - বাংলা	bn
Marathi - मराठी	mr
Telugu - తెలుగు	te
English	en
Malayalam - മലയാളം	ml
Assamese - অসমীয়া	as
Odia - ଓଡ଼ିଆ	or
French - français	fr
Arabic - عربى	ar
German - Deutsche	de
Spanish - Español	es
Japanese - 日本人	ja
Italian - italiano	it
Dutch (Netherlands)	nl
Portuguese (Portugal, Brazil	pt
Vietnamese - Tiếng Việt	vi
Indonesian (Bhasa)	id
Urdu - کا کوڈ	ur
Chinese - simplified - 简体中文	zh-CN
Chinese - Traditional - 中國傳統的	zh-TW
Kashmiri	ksm
Konkani	gom
Manipuri - ꯃꯅꯤꯄꯨꯔꯤꯗꯥ ꯂꯩꯕꯥ꯫	mni-Mtei
Nepali - नेपाली	ne
Sanskrit - संस्कृत	sa
Sindhi - سنڌي‎	sd
Bodo	bodo
Santhali	snthl
Maithili - मैथिली	mai
Dogri - डोगरी	doi
Malay - Melayu	ms
Filipino	tl


Example of npx based mcp server configuration:
"@21st-dev/magic": {
  "command": "npx",
  "args": [
    "-y",
    "@21st-dev/magic@latest",
    "API_KEY=\"xxxxxxxxxxxxxxxxxxxx\""
  ]
}