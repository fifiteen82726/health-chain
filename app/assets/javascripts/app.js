App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    console.log(web3);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('/abi', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ElectionArtifact = data;
      App.contracts.Election = TruffleContract(ElectionArtifact);

      // Set the provider for our contract
      App.contracts.Election.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    // airline confirm customer's special request
    $(document).on('click', '#confirm', App.createOrderRequest);
  },

  // if airline confirm user's request, create a record in blockchain
  createOrderRequest: function(){
    var airlineInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Election.deployed().then(function(instance) {
        airlineInstance = instance;
        // Execute adopt as a transaction by sending account
        return airlineInstance.createOrderRequest(1, true, "0664441aca014fb2482fb6d412d506391c15e0a10645d1a4ec25869c234de7fb39eb056211a86037663d4440d22455e638394cb4f56a9694a7b89e7577ede2a5");
      }).then(function(result) {
        debugger
        // return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
        debugger
      });
    });
  },

  // fetch data from BlockChain
  // markAdopted: function(adopters, account) {
  //   var adoptionInstance;

  //   App.contracts.Election.deployed().then(function(instance) {
  //     adoptionInstance = instance;
  //     // return adoptionInstance.candidatesCount.call();
  //   }).then(function(result) {
  //     // return BlockChain API request
  //     console.log(result);
  //   /*
  //    * Replace me...
  //    */
  //  });
  // }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
