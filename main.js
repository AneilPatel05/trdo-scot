const { Streamer } = require('steem-stream');

const options = {
    ACTIVE_KEY: '',
	POSTING_KEY: '',
    APP_NAME: 'trendotoken',
    USERNAME: 'trendotoken',
    BLOCK_CHECK_INTERVAL: 20,
	BLOCKS_BEHIND_WARNING: 10
  }

const ss = new Streamer(options);
const from = 'trendotoken';
const symbol = 'TRDO';
const memo = 'Here are your trendo tokens!'
var lastrewardcycleblocknum = 0;
const rewardcyclefrequency = 1200;
var hourlybalance = 2000;
var callers = [];
// Kickstart the streamer to watch the Steem blockchain
ss.start();

ss.onComment((op, blockNumber, blockId, prevBlockId, trxId, blockTime) => {
    var commentBody = op.body;
	var patternMatch = '!trendotoken';

	if(commentBody.match(patternMatch)){
		//op.body ==='!trendotoken'
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
        if(hourlybalance >= 10){
            //check if user has already called the block
            let caller = callers.find(c => c.caller === op.author);
                console.log("caller "+caller);
                if(caller!=undefined && caller.calls <5){
                        ss.transferSteemEngineTokens(from, op.author  , amount = '2', symbol, memo)
                        //send next txn after 3.5 Sec - only one custom json per block
                        setTimeout(function(){
                            ss.transferSteemEngineTokens(from, op.parent_author , amount = '8', symbol , memo)
                        },3500)

                        hourlybalance -= 10
                        let obj = callers.find(
                            (o, i) => {
                            if (o.caller === op.author) {
                                callers[i] = { name: op.author, calls: caller.calls+1 };
                                return true; // stop searching
                            }
                        })
                        console.log('Sent tokens to '+op.parent_author+' and '+op.author+' hourlybalance '+hourlybalance+' users rewarded '+callers.length);
                    } else if(caller!=undefined && caller.calls>5){
                        console.log("Caller limit reached for "+op.author)
                    }
                  if(caller === undefined){
                    ss.transferSteemEngineTokens(from, op.author  , amount = '2', symbol, memo)
                        //send next txn after 3.5 Sec - only one custom json per block
                        setTimeout(function(){
                            ss.transferSteemEngineTokens(from, op.parent_author , amount = '8', symbol , memo)
                        },3500)

                        hourlybalance -= 10
                        let totalcalls = callers.push({"caller":op.author,"calls":1})
                        console.log('Sent tokens to '+op.parent_author+' and '+op.author+' hourlybalance '+hourlybalance+' users rewarded '+totalcalls);
                }
        } else {
                console.log('Reward Limit Reached today, try again ');
            }
    }
});