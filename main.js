const { Streamer } = require('steem-stream');

const options = {
    ACTIVE_KEY: '',
    APP_NAME: 'trendotoken',
    USERNAME: 'trendotoken',
    BLOCK_CHECK_INTERVAL: 20
  }
  
const ss = new Streamer(options);
const from = 'trendotoken';
const symbol = 'TRDO';
const memo = 'Here are your trendokens!'
var lastrewardcycleblocknum = 0;
const rewardcyclefrequency = 28800;
var dailybalance = 2000;
// Kickstart the streamer to watch the Steem blockchain
ss.start();

ss.onComment((op, blockNumber, blockId, prevBlockId, trxId, blockTime) => {
    if(op.body ==='!trendo'){
        // let accounts = []
        // accounts.push({
        //     account: op.author,
        //     amount: '2.00'
        // })
        // accounts.push({
        //     account: op.parent_author,
        //     amount: '8.00'
        // })
        // ss.transferSteemEngineTokensMultiple(from, accounts , symbol, memo , amount = '0')
        if(dailybalance >= 10){
            ss.transferSteemEngineTokens(from, op.author  , amount = '2', symbol, memo)
            setTimeout(function(){
                ss.transferSteemEngineTokens(from, op.parent_author , amount = '8', symbol , memo)
            },3500)

            dailybalance -= 10
            console.log('Sent tokens to '+op.parent_author+' and '+op.author+' dailybalance '+dailybalance);
        } else{
            console.log('Reward Limit Reached today, try again ');
        }

        
    }
});
