import '../stylesheets/app.css';
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';
import { default as CryptoJS } from 'crypto-js';
import './browser-solc.js';

var accounts;
var account;
var foodSafeContract;
var foodSafeCode;
var roles = {PRODUCER: "Producer" ,DISTRIBUTOR:"Distributor", RETAILER:"Retailer"};
//var Accounts = require('web3-eth-accounts');
//var accounts = new Accounts('ws://localhost:8545');
window.App = {
  start: function () {
    var self = this;
    web3.eth.getAccounts(function (err, accs) {
      
      console.log(accs);
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      accounts = accs;
      account = accounts[0];
      web3.eth.defaultAccount = account;

      BrowserSolc.loadVersion('soljson-v0.4.17+commit.bdeb9e52.js', function (compiler) {
        
        foodSafeContract = web3.eth.contract([
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "Public_Address",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "Name",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "Role",
                "type": "uint8"
              },
              {
                "indexed": false,
                "name": "Confirmation",
                "type": "string"
              }
            ],
            "name": "LogRoleSet",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              },
              {
                "name": "_distributor_product_info",
                "type": "bytes32"
              },
              {
                "name": "_distributor_product_value",
                "type": "uint256"
              },
              {
                "name": "_d_in",
                "type": "uint8"
              }
            ],
            "name": "enterDistributorDetails",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              },
              {
                "name": "_quantity",
                "type": "uint256"
              },
              {
                "name": "_addr",
                "type": "address"
              },
              {
                "name": "_p_in",
                "type": "uint8"
              }
            ],
            "name": "paymentByDistributor",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              },
              {
                "name": "_producer_product_name",
                "type": "bytes32"
              },
              {
                "name": "_info_organic",
                "type": "bytes32"
              },
              {
                "name": "_producer_product_info",
                "type": "bytes32"
              },
              {
                "name": "_producer_product_value",
                "type": "uint256"
              },
              {
                "name": "_producer_product_price",
                "type": "uint256"
              },
              {
                "name": "_p_in",
                "type": "uint8"
              }
            ],
            "name": "producerEnterProductDetails",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "",
                "type": "string"
              }
            ],
            "name": "LogProductDetailsByRetailer",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "Retailer_address",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "Product_Name",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "DAmount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "RAmount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "Distributor_Address",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "Detail",
                "type": "string"
              }
            ],
            "name": "LogPaymentByRetailer",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_name",
                "type": "bytes32"
              },
              {
                "name": "_addr",
                "type": "bytes32"
              },
              {
                "name": "_entity_info",
                "type": "bytes32"
              }
            ],
            "name": "setEntityInfo",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "ADDRESS",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "INFO",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "VALUE",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "",
                "type": "uint8"
              },
              {
                "indexed": false,
                "name": "",
                "type": "string"
              }
            ],
            "name": "LogProductDetailsByDistributor",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "Amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "Distributor_address",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "Product_Name",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "PAmount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "DAmount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "name": "Producer_Address",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "Detail",
                "type": "string"
              }
            ],
            "name": "LogPaymentByDistributor",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "Detail",
                "type": "string"
              },
              {
                "indexed": false,
                "name": "Name",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "Public_Address",
                "type": "address"
              }
            ],
            "name": "LogEntityInfoSet",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "name": "",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "",
                "type": "address"
              },
              {
                "indexed": false,
                "name": "",
                "type": "bytes32"
              },
              {
                "indexed": false,
                "name": "",
                "type": "uint8"
              },
              {
                "indexed": false,
                "name": "",
                "type": "string"
              }
            ],
            "name": "LogProductDetailsByProducer",
            "type": "event"
          },
          {
            "constant": false,
            "inputs": [
              {
                "name": "_addr",
                "type": "address"
              },
              {
                "name": "_role",
                "type": "uint8"
              },
              {
                "name": "_amt",
                "type": "uint256"
              }
            ],
            "name": "setRole",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [],
            "name": "chair_person",
            "outputs": [
              {
                "name": "",
                "type": "address"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "_address",
                "type": "address"
              }
            ],
            "name": "getEntityInfo",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              }
            ],
            "name": "getProductInfoByDistributor1",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              }
            ],
            "name": "getProductInfoByDistributor2",
            "outputs": [
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "uint256"
              },
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              }
            ],
            "name": "getProductInfoByProducer1",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "id",
                "type": "bytes32"
              }
            ],
            "name": "getProductInfoByProducer2",
            "outputs": [
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "uint256"
              },
              {
                "name": "",
                "type": "uint256"
              },
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "_addr",
                "type": "address"
              }
            ],
            "name": "getRole",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
              },
              {
                "name": "",
                "type": "bytes32"
              },
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
        ]);
       
      });
    });
  },

  
  setEntityInfo: function () {
    document.getElementById('message').innerText = 'adding entity information...';

    var _name = document.getElementById('_name').value;
    var _addr = document.getElementById('_addr').value;
    //var passPhrase = document.getElementById('passPhrase').value;
    var _entity_info = document.getElementById('_entity_info').value;
    
    
    //var encryptedSecret = CryptoJS.AES.encrypt(secret, passPhrase).toString();

    
    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');

    deployedFoodSafe.setEntityInfo( _name, _addr, _entity_info,  function (error) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }
      
      var logEntity = deployedFoodSafe.LogEntityInfoSet();
      logEntity.watch(function(error,result) {
        if(!error) {
          document.getElementById('blockHash').innerText = result.blockHash;
          var str1 = web3.toAscii(result.args.Name);
          document.getElementById('ename').innerText = str1;
          document.getElementById('print').innerText = result.args.Detail;
          
          console.log(result);
        }
      });
      document.getElementById('message').innerText = 'New entity is added';
    });
  },

  getEntityInfo: function () {
    document.getElementById('message').innerText = 'getting entity details...';

    //var passPhrase = document.getElementById('passPhrase').value;

    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    var address=document.getElementById('_address').value;
    deployedFoodSafe.getEntityInfo.call(address,function (error, trailCount) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var index = trailCount - 1;
      if (index < 0) {
        document.getElementById('message').innerText = 'No data found.';
        return;
      }
      
      
      deployedFoodSafe.getEntityInfo.call(address,function (error, returnValues) {
        if (error) {
          console.error(error);
          document.getElementById('message').innerText = error;
          return;
        }
        
        console.log(returnValues);
        document.getElementById('roles').value =returnValues[0];
        var ro = document.getElementById('roles').value;
        switch(ro) {
          case '0':
          var role = roles.PRODUCER;
          break;
          case '1':
          var role = roles.DISTRIBUTOR;
          break;
          case '2':
          var role = roles.RETAILER;
          break;
          default:
          break;
        }
        var r1 = web3.toAscii(returnValues[1]);
        var r2 = web3.toAscii(returnValues[2]);
        var r3 = web3.toAscii(returnValues[3]);
        document.getElementById('roles').value = role;
        document.getElementById('_name1').value = r1;
        document.getElementById('_addr1').value = r2;
        document.getElementById('_entity_info1').value = r3;
        
      });
    });
  },

  setRole: function () {
    document.getElementById('message').innerText = 'setting role...';

    var setAddress = document.getElementById('setAddress').value;
    var setRole = document.getElementById('setRole').value;
    var setAmount = document.getElementById('setAmount').value;
    
    
    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');

    deployedFoodSafe.setRole( setAddress,setRole,setAmount,  function (error) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }
      var logr = deployedFoodSafe.LogRoleSet();
      logr.watch(function(error,result) {
        if(!error) {
          
          console.log(result);
        }
      });
      document.getElementById('message').innerText = 'Role is added';
    });
  },

  getRole: function () {
    document.getElementById('message').innerText = 'getting role...';

    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    var address=document.getElementById('getAddress').value;
    deployedFoodSafe.getRole.call(address,function (error, trailCount) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var index = trailCount - 1;
      if (index < 0) {
        document.getElementById('message').innerText = 'No data found.';
        return;
      }
      
      
      deployedFoodSafe.getRole.call(address,function (error, returnValues) {
        if (error) {
          console.error(error);
          document.getElementById('message').innerText = error;
          return;
        }
        
        document.getElementById('getRole').value =returnValues[0];
        var ro = document.getElementById('getRole').value;
        switch(ro) {
          case '0':
          var role = roles.PRODUCER;
          break;
          case '1':
          var role = roles.DISTRIBUTOR;
          break;
          case '2':
          var role = roles.RETAILER;
          break;
          default:
          break;
        }
        
        document.getElementById('getRole').value =role;
        var r1= web3.toAscii(returnValues[1]);
        document.getElementById('getName').value = r1;
        document.getElementById('getAmount').value = returnValues[2];
        console.log(returnValues);
      });
    });
  },
  producerEnterProductDetails: function () {
    document.getElementById('message').innerText = 'adding product information...';

    var _id = document.getElementById('_id').value;
    var _name = document.getElementById('_pname').value;
    var _organic = document.getElementById('_organic').value;
    var _infog = document.getElementById('_infog').value;
    var _value = document.getElementById('_value').value;
    var _price = document.getElementById('_price').value;
    var _cond = document.getElementById('_cond').value;

    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');

    deployedFoodSafe.producerEnterProductDetails( _id, _name, _organic, _infog, _value, _price, _cond,  function (error) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }
      
      var logp = deployedFoodSafe.LogProductDetailsByProducer();
      logp.watch(function(error,resultp) {
        if(!error) {
        
          //document.getElementById('print').innerText = result.args.Detail;
          
          console.log(resultp);
        }
      });
      document.getElementById('message').innerText = 'New product is added';
    });
  },

  getProductInfoByProducer1: function () {
    document.getElementById('message').innerText = 'getting Product details...';

    //var passPhrase = document.getElementById('passPhrase').value;

    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    var _pid=document.getElementById('_pid').value;
    deployedFoodSafe.getProductInfoByProducer1.call(_pid,function (error, trailCount) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var index = trailCount - 1;
      if (index < 0) {
        document.getElementById('message').innerText = 'No data found.';
        return;
      }
      
      
      deployedFoodSafe.getProductInfoByProducer1.call(_pid,function (error, returnValues) {
        if (error) {
          console.error(error);
          document.getElementById('message').innerText = error;
          return;
        }
        
        console.log(returnValues);
        document.getElementById('_roles').value =returnValues[0];
        var ro = document.getElementById('_roles').value;
        switch(ro) {
          case '0':
          var role = roles.PRODUCER;
          break;
          case '1':
          var role = roles.DISTRIBUTOR;
          break;
          case '2':
          var role = roles.RETAILER;
          break;
          default:
          break;
        }
        var r1 = web3.toAscii(returnValues[1]);
        var r2 = web3.toAscii(returnValues[2]);
        var r3 = web3.toAscii(returnValues[3]);
        document.getElementById('_roles').value = role;
        document.getElementById('_name2').value = r1;
        document.getElementById('_addr2').value = r2;
        document.getElementById('_entity_info2').value = r3;

        deployedFoodSafe.getProductInfoByProducer2.call(_pid,function (error, returnValue) {
          if (error) {
            console.error(error);
            document.getElementById('message').innerText = error;
            return;
          }
          
          console.log(returnValue);
          
          var r4 = web3.toAscii(returnValue[0]);
          var r5 = web3.toAscii(returnValue[1]);
          var r6 = web3.toAscii(returnValue[2]);
          
          document.getElementById('_pname1').value =r4;
          document.getElementById('_porg').value = r5;
          document.getElementById('_pinfo').value = r6;
          document.getElementById('_pvalue').value = returnValue[3];
          document.getElementById('_pprice').value = returnValue[4];
          document.getElementById('_ptime').value = Date() ;
          console.log(returnValue[3]);
        });
        
      });
    });
  },
  
  getAmount: function() {
    document.getElementById('message').innerText = 'getting amount..';

    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    
    deployedFoodSafe.getAmount(function(error, _amt) {
      if (error) {
        console.log(error);
        document.getElementById('message').innerText = error;
        return;
      }
      
      console.log(_amt);
    
     
      //document.getElementById(_amt).value = _amt;
    });
  },

  paymentByDistributor: function() {
    
    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    var _dpid = document.getElementById('_dpid').value;
    var _damt = document.getElementById('_damt').value;
    var _daddr = document.getElementById('_daddr').value;
    var _dcond = document.getElementById('_dcond').value;

    deployedFoodSafe.paymentByDistributor( _dpid, _damt, _daddr, _dcond, function(error) {
      if (error) {
        console.log(error);
        document.getElementById('message').innerText = error;
        return;
      }
      var logPayment = deployedFoodSafe.LogPaymentByDistributor();
      logPayment.watch(function(error,result) {
        if(!error) {
          document.getElementById('blockHash1').innerText = result.blockHash;
         // var str1 = web3.toAscii(result.args.Name);
         // document.getElementById('ename').innerText = str1;
          document.getElementById('print1').innerText = result.args.Detail;
          
          console.log(result);
        }
      });
      document.getElementById('message').innerText = 'Payment is done and contract transferred from producer to distributor';
    });
  },

  enterDistributorDetails: function() {
    
    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    var _dppid = document.getElementById('_dppid').value;
    var _dpinfo = document.getElementById('_dpinfo').value;
    var _dpvalue = document.getElementById('_dpvalue').value;
    var _dpcond = document.getElementById('_dpcond').value;

    deployedFoodSafe.enterDistributorDetails( _dppid, _dpinfo, _dpvalue, _dpcond, function(error) {
      if (error) {
        console.log(error);
        document.getElementById('message').innerText = error;
        return;
      }
      
      var logd = deployedFoodSafe.LogProductDetailsByDistributor();
      logd.watch(function(error,resultd) {
        if(!error) {
          
          console.log(resultd);
        }
      });
      document.getElementById('message').innerText = 'Details are entered';
    });
  },

  getProductInfoByDistributor1: function () {
    document.getElementById('message').innerText = 'getting Product details...';

    //var passPhrase = document.getElementById('passPhrase').value;

    var deployedFoodSafe = foodSafeContract.at('0x709e2c5bd391833080ad4a4537cfb9b08937bca4');
    var _pid1=document.getElementById('_pid1').value;
    deployedFoodSafe.getProductInfoByDistributor1.call(_pid1,function (error, trailCount) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var index = trailCount - 1;
      if (index < 0) {
        document.getElementById('message').innerText = 'No data found.';
        return;
      }
      
      
      deployedFoodSafe.getProductInfoByDistributor1.call(_pid1,function (error, returnValues) {
        if (error) {
          console.error(error);
          document.getElementById('message').innerText = error;
          return;
        }
        
        console.log(returnValues);
        document.getElementById('_roles').value =returnValues[0];
        var ro = document.getElementById('_roles').value;
        switch(ro) {
          case '0':
          var role = roles.PRODUCER;
          break;
          case '1':
          var role = roles.DISTRIBUTOR;
          break;
          case '2':
          var role = roles.RETAILER;
          break;
          default:
          break;
        }
        var r1 = web3.toAscii(returnValues[1]);
        var r2 = web3.toAscii(returnValues[2]);
        var r3 = web3.toAscii(returnValues[3]);
        document.getElementById('_roles3').value = role;
        document.getElementById('_name3').value = r1;
        document.getElementById('_addr3').value = r2;
        document.getElementById('_entity_info3').value = r3;

        deployedFoodSafe.getProductInfoByDistributor2.call(_pid1,function (error, returnVal) {
          if (error) {
            console.error(error);
            document.getElementById('message').innerText = error;
            return;
          }
          console.log(_pid1);
          console.log(returnVal);
          var r4 = web3.toAscii(returnVal[0]);
          document.getElementById('_pinfo3').value =r4;
          document.getElementById('_pvalue3').value = returnVal[1];
          document.getElementById('_ptime3').value = Date();
        });
        
      });
    });
  },
  
  paymentByRetailer: function() {
    
    var deployedFoodSafe = foodSafeContract.at('0x6d57e484043ee6349be3fb65792dccedd48fe848');
    var _drpid = document.getElementById('_drpid').value;
    var _dramt = document.getElementById('_dramt').value;
    var _draddr = document.getElementById('_draddr').value;
    var _drcond = document.getElementById('_drcond').value;

    deployedFoodSafe.paymentByRetailer( _drpid, _dramt, _draddr, _drcond, function(error) {
      if (error) {
        console.log(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var logPayment = deployedFoodSafe.LogPaymentByRetailer();
      logPayment.watch(function(error,result) {
        if(!error) {
          document.getElementById('blockHash2').innerText = result.blockHash;
         // var str1 = web3.toAscii(result.args.Name);
         // document.getElementById('ename').innerText = str1;
          document.getElementById('print2').innerText = result.args.Detail;
          
          console.log(result);
        }
      });
      document.getElementById('message').innerText = 'Payment is done and contract transferred from distributed to retailer';
    });
  },

  enterRetailerDetails: function() {
    
    var deployedFoodSafe = foodSafeContract.at('0x9E659836c21b9518C87De59632295271dAB41D96');
    var _rpid = document.getElementById('_rpid').value;
    var _rinfo = document.getElementById('_rinfo').value;
    var _rvalue = document.getElementById('_rvalue').value;
    var _rcond = document.getElementById('_rcond').value;

    deployedFoodSafe.enterRetailerDetails( _rpid, _rinfo, _rvalue, _rcond, function(error) {
      if (error) {
        console.log(error);
        document.getElementById('message').innerText = error;
        return;
      }
      
      var logd = deployedFoodSafe.LogProductDetailsByRetailer();
      logd.watch(function(error,resultd) {
        if(!error) {
          
          console.log(resultd);
        }
      });
      document.getElementById('message').innerText = 'Details are entered';
    });
  },

  getProductInfoByRetailer1: function () {
    document.getElementById('message').innerText = 'getting Product details...';

    //var passPhrase = document.getElementById('passPhrase').value;

    var deployedFoodSafe = foodSafeContract.at('0x9E659836c21b9518C87De59632295271dAB41D96');
    var _rpid=document.getElementById('_rpid').value;
    deployedFoodSafe.getProductInfoByRetailer1.call(_rpid,function (error, trailCount) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var index = trailCount - 1;
      if (index < 0) {
        document.getElementById('message').innerText = 'No data found.';
        return;
      }
      
      
      deployedFoodSafe.getProductInfoByRetailer1.call(_rpid,function (error, returnValues) {
        if (error) {
          console.error(error);
          document.getElementById('message').innerText = error;
          return;
        }
        
        console.log(returnValues);
        document.getElementById('_rroles').value =returnValues[0];
        var ro = document.getElementById('_rroles').value;
        switch(ro) {
          case '0':
          var role = roles.PRODUCER;
          break;
          case '1':
          var role = roles.DISTRIBUTOR;
          break;
          case '2':
          var role = roles.RETAILER;
          break;
          default:
          break;
        }
        var r1 = web3.toAscii(returnValues[1]);
        var r2 = web3.toAscii(returnValues[2]);
        var r3 = web3.toAscii(returnValues[3]);
        document.getElementById('_rroles').value = role;
        document.getElementById('_rname').value = r1;
        document.getElementById('_raddr').value = r2;
        document.getElementById('_rentity_info').value = r3;

        deployedFoodSafe.getProductInfoByRetailer2.call(_rpid,function (error, returnVal) {
          if (error) {
            console.error(error);
            document.getElementById('message').innerText = error;
            return;
          }
          
          console.log(returnVal);
          var r4 = web3.toAscii(returnVal[0]);
          document.getElementById('_rpinfo').value =r4;
          document.getElementById('_rpvalue').value = returnVal[1];
          document.getElementById('_rptime').value = Date();
        });
        
      });
    });
  },
  
  getBasicProductInfo1: function () {
    document.getElementById('message').innerText = 'getting Product details...';

    //var passPhrase = document.getElementById('passPhrase').value;

    var deployedFoodSafe = foodSafeContract.at('0x9E659836c21b9518C87De59632295271dAB41D96');
    var _pid3=document.getElementById('_pid3').value;
    deployedFoodSafe.getBasicProductInfo1.call(_pid3,function (error, trailCount) {
      if (error) {
        console.error(error);
        document.getElementById('message').innerText = error;
        return;
      }

      var index = trailCount - 1;
      if (index < 0) {
        document.getElementById('message').innerText = 'No data found.';
        return;
      }
      
      
      deployedFoodSafe.getBasicProductInfo1.call(_pid3,function (error, returnValues) {
        if (error) {
          console.error(error);
          document.getElementById('message').innerText = error;
          return;
        }
        
        console.log(returnValues);
        var r0 = web3.toAscii(returnValues[0]);
        var r1 = web3.toAscii(returnValues[1]);
        var r2 = web3.toAscii(returnValues[2]);
        var r3 = web3.toAscii(returnValues[3]);
        var r4 = web3.toAscii(returnValues[4]);
        
        document.getElementById('_rcname').value = r0;
        document.getElementById('_rcaddr').value = r1;
        document.getElementById('_rcentity_info').value = r2;
        document.getElementById('_rcorganic').value = r3;
        document.getElementById('_rcpinfo').value = r4;
        

        deployedFoodSafe.getBasicProductInfo2.call(_pid3,function (error, returnVal) {
          if (error) {
            console.error(error);
            document.getElementById('message').innerText = error;
            return;
          }
          
          var r5 = web3.toAscii(returnVal[0]);
          var r6 = web3.toAscii(returnVal[1]);
          var r7 = web3.toAscii(returnVal[2]);
          document.getElementById('_rcname1').value = r5;
          document.getElementById('_rpcaddr').value = r6;
          document.getElementById('_rcinfo').value = r7;
        });
        
      });
    });
  },

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
