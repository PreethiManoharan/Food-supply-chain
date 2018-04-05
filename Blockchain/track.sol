pragma solidity ^0.4.21;

/* Verifier 
*   1) To register the entity to central authority for verification 
*   2) Also, To assign the role to each entity by the central authority 
*/

contract Verifier{
    /// For storing each entity detail 
    /// structures 
    struct entityDetail{
        bytes32 name;
        bytes32 addr;
        bytes32 entity_info;
    }

    /// To define the role of a person by the chairperson 
    enum roles {Producer, Distributor, Retailer, none}
    /// mapping the address to roles and initial amount value 
    mapping(address => roles) verified_address;
    mapping(address => uint) initial_amt;
    
    address public chair_person = msg.sender;

    /// modifiers 
    modifier onlyBy(address _account)
    {
        require(msg.sender == _account);
        _;
    }

    /// Events
    event LogEntityInfoSet(string Detail,bytes32 Name, address Public_Address);
    event LogRoleSet(address Public_Address,bytes32 Name,roles Role,string Confirmation);
    
    /// Constructor
    function Verifier() public{
        initial_amt[chair_person] = 1000;
    }
    
    /// Mapping entity to its info 
     mapping(address => entityDetail)EntityDB;
    
    /// To set the entity info 
    /// visible to public to enter data 
    /// input : entity detail 
    /// output : bool 
    function setEntityInfo(bytes32 _name,bytes32 _addr, bytes32 _entity_info) public returns(bool)
    {
        
        EntityDB[msg.sender].name = _name;
        EntityDB[msg.sender].addr = _addr;
        EntityDB[msg.sender].entity_info = _entity_info;
        emit LogEntityInfoSet("Entered Details",_name,msg.sender);
        return true;
    }
    
    /// To get the entity info 
    /// visible to public to get data 
    /// input : entity address 
    /// output : entity detail 
     function getEntityInfo(address _address) public constant returns(roles,bytes32,bytes32,bytes32)
    {
        return(verified_address[_address],EntityDB[_address].name,EntityDB[_address].addr,
        EntityDB[_address].entity_info);
    }
    
    /// The roles and initial digital tokens are assigned by the chair_person to each entity registered 
    /// This function can be performed by only chair_person 
    /// input : entity address, role, token 
    /// output : bool confirmation
    function setRole(address _addr, roles _role, uint _amt) onlyBy(chair_person) public returns(bool) {
        verified_address[_addr] = _role;
        assert(initial_amt[chair_person]>=_amt);
        initial_amt[_addr] += _amt;
        initial_amt[chair_person] -= _amt;
        emit LogRoleSet(_addr,EntityDB[_addr].name,_role,"verified");
        return true;
    }

    /// To get the role of the each entity 
    /// visible to public to get data 
    /// input : entity address 
    /// output : entity role, tokens provided to entity 
    function getRole(address _addr) public constant returns(roles,bytes32,uint){
        assert(chair_person == msg.sender);
        
        return (verified_address[_addr],EntityDB[_addr].name,initial_amt[_addr]);
    }
}


/* ProductDetails
* 1) To enter the product details by each entity, to track the product 
* 2) Legal contract is generated to pay the digital currency, if the conditions are meet
*/ 
contract PdtDetails is Verifier{

    /// Set of conditions 
    enum conditions{undamaged, temperature_maintained, agree_upon_amount, none}

    /// Structure for Product Details 
    struct Product{
        /// Set obtained from producer of the product
        address producer_address;
        bytes32 producer_product_name;
        bytes32 info_organic;
        bytes32 producer_product_info;
        uint producer_product_value;
        uint producer_product_price;
        uint producer_timestamp;
        ///  Set obtained from distributor of the product 
        address distributor_address;
        bytes32 distributor_product_info;
        uint distributor_product_value;
        uint distributor_product_price;
        uint distributor_timestamp;
        /// Set obtained from retailer of the product
        address retailer_address;
        bytes32 retailer_product_info;
        uint retailer_product_value;
        uint retailer_product_price;
        uint retailer_timestamp;
        ///  Initial condition details provided by each entity
        conditions p;
        conditions d;
        conditions r;
    }
    
    ///  Modifiers 
    /// Allows only producer to modify 
    modifier onlyProducer(address _address){
       require(verified_address[_address] == roles.Producer);
       _;
    }
    ///  Allows only distributor to modify 
    modifier onlyDistributor(address _address){
        require(verified_address[_address] == roles.Distributor);
        _;
    }
    /// Allows only retailer to modify 
    modifier onlyRetailer(address _address){
        require(verified_address[_address] == roles.Retailer);
        _;
    }
    /// Allows only different entity involved in supply-chain to modify 
    modifier onlyOwner(address _address){
        require((verified_address[_address] == roles.Producer) || 
        (verified_address[_address] == roles.Distributor) || 
        (verified_address[_address] == roles.Retailer));
        _;
    }
    
    /// Mapping id to ProductDetails 
    mapping(bytes32 => Product) ProductDB;
    
    /// events
    event LogProductDetailsByProducer(bytes32,address,bytes32,conditions,string);
    event LogPaymentByDistributor(uint Amount,address Distributor_address,bytes32 Product_Name,uint PAmount,uint DAmount,address Producer_Address,string Detail);
    event LogProductDetailsByDistributor(address ADDRESS,bytes32 INFO,uint VALUE,conditions,string);
    event LogPaymentByRetailer(address Retailer_address,bytes32 Product_Name,uint DAmount,uint RAmount,address Distributor_Address,string Detail);
    event LogProductDetailsByRetailer(address,bytes32,string);
    
    /// Producer provides the product detail and assigns an id to the product 
    ///  Also,to map the producer public address to product id for tracking 
    /// input : product details 
    ///  output : bool, eventLog 
   function producerEnterProductDetails(bytes32 id,bytes32 _producer_product_name,bytes32 _info_organic, 
    bytes32 _producer_product_info, uint _producer_product_value, uint _producer_product_price, conditions _p_in) 
   onlyProducer(msg.sender) public returns(bool)
   {
        
        ProductDB[id].producer_product_name = _producer_product_name;
        ProductDB[id].info_organic = _info_organic;
        ProductDB[id].producer_product_value = _producer_product_value;
        ProductDB[id].producer_product_price = _producer_product_price;
        ProductDB[id].producer_product_info = _producer_product_info;
        ProductDB[id].producer_timestamp = now;
        ProductDB[id].producer_address = msg.sender;
        ProductDB[id].p = _p_in;
        emit LogProductDetailsByProducer(EntityDB[msg.sender].name, msg.sender, id, _p_in, 
        "Product detail entered by Producer");
        return true;
   }
   
    ///  To get Producer details linked to the product 
    ///  input : product id 
    ///  output : producer details 
    function getProductInfoByProducer1(bytes32 id)  
        constant public returns(roles,bytes32,bytes32,bytes32)
    {
        assert((verified_address[msg.sender] == roles.Producer) || 
        (verified_address[msg.sender] == roles.Distributor) || 
        (verified_address[msg.sender] == roles.Retailer));
        
        return (verified_address[ProductDB[id].producer_address],
                EntityDB[ProductDB[id].producer_address].name,
                EntityDB[ProductDB[id].producer_address].addr,
                EntityDB[ProductDB[id].producer_address].entity_info);
    }
    
    /// To get Product details provided by the producer 
    /// input : product id 
    /// output : product details 
    function getProductInfoByProducer2(bytes32 id) 
        constant public returns(bytes32,bytes32,bytes32,uint,uint,uint)
    {
        assert((verified_address[msg.sender] == roles.Producer) || 
        (verified_address[msg.sender] == roles.Distributor) || 
        (verified_address[msg.sender] == roles.Retailer));
        
        return(ProductDB[id].producer_product_name,
            ProductDB[id].info_organic,
            ProductDB[id].producer_product_info, 
            ProductDB[id].producer_product_value,
            ProductDB[id].producer_product_price,
            ProductDB[id].producer_timestamp);
    }
    
    
    /// To pay digital token by the distributor if conditions are meet 
    /// Also, to map the distributor public address to the product id for tracking 
    /// input : product id, producer public address, amount, condition to satisfy 
    /// output : bool confirmation 
    function paymentByDistributor(bytes32 id, uint _quantity, address _addr, conditions _p_in) 
    onlyDistributor(msg.sender) public returns(bool)
    {
        uint _amount;
        require(verified_address[_addr] == verified_address[ProductDB[id].producer_address]);
        require(initial_amt[msg.sender] >= _amount);
        require(ProductDB[id].p == _p_in);
        require(_quantity<=ProductDB[id].producer_product_value);
        
        _amount = _quantity * ProductDB[id].producer_product_price; 
        initial_amt[_addr] += _amount;
        initial_amt[msg.sender] -= _amount;
        ProductDB[id].distributor_address = msg.sender;
        emit LogPaymentByDistributor(_amount,msg.sender,ProductDB[id].producer_product_name,initial_amt[_addr],initial_amt[msg.sender],_addr,
        "Payment By Distributor Confirmed and Contract transferred from Producer to Distributor");
        return true;
    }
    
    /// Distributor writes the product details associated with the product id 
    /// input : product id, distributor related info 
    /// output : string confrimation 
    function enterDistributorDetails(bytes32 id, bytes32 _distributor_product_info, 
    uint _distributor_product_value, conditions _d_in) onlyDistributor(msg.sender) public returns (bool) 
    {
       
       ProductDB[id].distributor_product_info = _distributor_product_info;
       ProductDB[id].distributor_product_value = _distributor_product_value;
       ProductDB[id].distributor_timestamp = now;
       ProductDB[id].d = _d_in;
       emit LogProductDetailsByDistributor(msg.sender,id,_distributor_product_value,_d_in,
       "Product detail entered by Distributor");
        return true ;
    }
    
    /// To get distributor details linked to the product 
    /// input : product id 
    /// output : Distributor details 
    function getProductInfoByDistributor1(bytes32 id)  
        constant public returns(roles,bytes32,bytes32,bytes32)
    {
        assert((verified_address[msg.sender] == roles.Producer) || 
        (verified_address[msg.sender] == roles.Distributor) || 
        (verified_address[msg.sender] == roles.Retailer));
        
        return (verified_address[ProductDB[id].distributor_address],
                EntityDB[ProductDB[id].distributor_address].name,
                EntityDB[ProductDB[id].distributor_address].addr,
                EntityDB[ProductDB[id].distributor_address].entity_info);
    }
    
    ///  To get Product details provided by the distributor 
    /// input : product id 
    /// output : product details 
    function getProductInfoByDistributor2(bytes32 id) 
        constant public returns(bytes32,uint,uint)
    {
        assert((verified_address[msg.sender] == roles.Producer) || 
        (verified_address[msg.sender] == roles.Distributor) || 
        (verified_address[msg.sender] == roles.Retailer));
        
        return(ProductDB[id].distributor_product_info,
               ProductDB[id].distributor_product_value, 
               ProductDB[id].distributor_timestamp);
    }
    
     
   
    
}