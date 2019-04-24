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
    $.getJSON('Election.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ElectionArtifact = data;
      App.contracts.Election = TruffleContract(ElectionArtifact);

      // Set the provider for our contract
      App.contracts.Election.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  // fetch data from BlockChain
  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Election.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.candidatesCount.call();
    }).then(function(result) {
      // return BlockChain API request
      console.log(result);
    /*
     * Replace me...
     */
   });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
