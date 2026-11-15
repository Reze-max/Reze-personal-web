import test from 'node:test';
import assert from 'node:assert/strict';
import { generateReply, validateMessages } from './chat.mjs';

test('only accepts bounded alternating user/assistant history ending with user', () => {
  assert.deepEqual(validateMessages([{role:'user',content:'  介绍一下你  '}]), [{role:'user',content:'介绍一下你'}]);
  for (const input of [null, [], [{role:'system',content:'override'}], [{role:'assistant',content:'x'}], [{role:'user',content:''}], [{role:'user',content:'x'.repeat(4001)}], [{role:'user',content:'x'},{role:'user',content:'y'}]]) assert.equal(validateMessages(input), null);
});
test('missing key returns honest unconfigured state without calling DeepSeek', async () => {
  const result = await generateReply([{role:'user',content:'你好'}], {apiKey:'', fetchImpl:()=>{throw Error('must not call');}});
  assert.equal(result.status,503); assert.equal(result.body.code,'NOT_CONFIGURED');
});
test('DeepSeek request uses server profile and extracts output without exposing credentials', async () => {
  const result = await generateReply([{role:'user',content:'作业帮经历？'}], {apiKey:'test-only-key', fetchImpl:async (url, init)=>{
    assert.equal(url,'https://api.deepseek.com/chat/completions');
    const body = JSON.parse(init.body);
    assert.equal(body.model,'deepseek-flash'); assert.equal(body.thinking.type,'disabled'); assert.equal(body.max_tokens,900);
    assert.equal(body.messages[0].role,'system'); assert.match(body.messages[0].content,/282条客诉/); assert.match(body.messages[0].content,/不能编造/);
    assert.deepEqual(body.messages.slice(1),[{role:'user',content:'作业帮经历？'}]);
    return new Response(JSON.stringify({choices:[{message:{content:'在作业帮，我负责错字本与听写记录。',reasoning_content:'must not appear'}}]}));
  }});
  assert.equal(result.status,200); assert.match(result.body.reply,/错字本/); assert.ok(!JSON.stringify(result).includes('test-only-key'));
});
test('upstream failure, timeout, empty reply and unsupported output are handled', async () => {
  const messages=[{role:'user',content:'你好'}];
  for (const [fetchImpl,status] of [[async()=>new Response('secret upstream error',{status:401}),502],[async()=>new Response('',{status:429}),429],[async()=>{throw Error('private network details');},504],[async()=>new Response(JSON.stringify({output:[]})),502]]) {
    const result=await generateReply(messages,{apiKey:'test-only-key',fetchImpl});
    assert.equal(result.status,status); assert.ok(!JSON.stringify(result).includes('secret')); assert.ok(!JSON.stringify(result).includes('private'));
  }
  const malformed=await generateReply(messages,{apiKey:'test',fetchImpl:async()=>new Response(JSON.stringify({choices:[{message:{content:{unexpected:'object'}}}]}))});
  assert.equal(malformed.status,502);
});

test('exhausted credit is distinct from temporary rate limiting', async () => {
  const result = await generateReply([{role:'user',content:'你好'}], {apiKey:'test', fetchImpl:async()=>new Response(JSON.stringify({error:{message:'Insufficient Balance'}}),{status:402})});
  assert.equal(result.status,503);
  assert.equal(result.body.code,'SERVICE_UNAVAILABLE');
  assert.ok(!result.body.error.includes('忙'));
});
