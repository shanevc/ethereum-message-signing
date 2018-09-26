import React, {Component} from "react";
import getWeb3 from "./utils/getWeb3";
import sigUtil from "eth-sig-util";

import "./App.css";

class App extends Component {
    state = {storageValue: 0, web3: null, accounts: null};

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            this.setState({web3, accounts});
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`
            );
            console.log(error);
        }
    };

    signMessage = async () => {
        const {web3, accounts} = this.state;
        let _from = accounts[0];
        const msgParams = [
            {
                type: 'string',      // Any valid solidity type
                name: 'Message',     // Any string label you want
                value: 'Hi, Alice!'  // The value to sign
            },
            {
                type: 'uint32',
                name: 'A number',
                value: '1337'
            }
        ];

        web3.currentProvider.sendAsync({
            method: 'eth_signTypedData',
            params: [msgParams, _from],
            from: _from
        }, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Personal Signed:' + JSON.stringify(result.result));

            let verifyMessage;
            const recoveredSigner = sigUtil.recoverTypedSignature({
                data: msgParams,
                sig: result.result
            });

            if (recoveredSigner.toLowerCase() === _from.toLowerCase()) {
                verifyMessage = "Verified message was signed by " + _from;
                alert(verifyMessage)
            } else {
                verifyMessage = "MESSAGE WAS NOT SIGNED BY " + _from;
                alert(verifyMessage)
            }
        });
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <input type="button" value="Sign Message" onClick={this.signMessage} />
            </div>
        );
    }
}

export default App;
