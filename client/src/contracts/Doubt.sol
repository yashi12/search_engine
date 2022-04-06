pragma solidity ^0.5.11;

contract Mycontract {

    string public name;

    constructor() public {
        name = "Doubt Session Contract" ;
    }

    mapping (string => Session) public sessions ;
    //mapping (string => CrowdSessionPayments) payments ;

    struct Session {
        uint amount;
        address doubtAsker;
        address payable doubtSolver;
        string topic;
        string id;
        bool isCompleted;
    }

    event SessionCreated (
        uint amount,
        address doubtAsker,
        address payable doubtSolver,
        string topic,
        string id,
        bool isCompleted
    );

    event SessionEnded (
        uint amount,
        address doubtAsker,
        address payable doubtSolver,
        string topic,
        string id,
        bool isCompleted
    );

    function balance() external view returns(uint){
        return address(this).balance;
    }

    function createSession(uint amount, address doubtAsker,address payable doubtSolver,string memory topic,string memory id) public payable{
        // Check for valid info
        require(bytes(topic).length > 0);
        require(bytes(id).length > 0);
        require(amount > 0);
        // Check transaction amount
        //require(msg.value == amount);
        // Create session
        sessions[id] = Session(amount,doubtAsker,doubtSolver,topic,id,false);
        // Trigger and emit event
        emit SessionCreated(amount, doubtAsker, doubtSolver, topic, id, false);
    }

    function getSesionData(string calldata id) external view returns(uint, address, address, string memory, string memory, bool ){
        Session memory _session = sessions[id];
        return (_session.amount, _session.doubtAsker, _session.doubtSolver, _session.topic, _session.id, _session.isCompleted);
    }

    function endSession(string calldata id) external payable {
        // Fetch the session
        Session memory _session = sessions[id];
        // Fetch address of doubt solver
        address payable _doubtSolver = _session.doubtSolver;
        // Pay the doubt solver by sending them Ether
        address(_doubtSolver).transfer(_session.amount);
        // Update the completion
        _session.isCompleted = true;
        // Update the session
        sessions[id] = _session;
        // Trigger and emit event
        emit SessionEnded(_session.amount, _session.doubtAsker, _session.doubtSolver, _session.topic, _session.id, _session.isCompleted);
    }

    // struct CrowdSession {
    //     uint amountAsked;
    //     uint amountFunded;
    //     address payable [] participants;
    //     address payable doubtSolver;
    //     string topic;
    //     string id;
    //     bool compeleted ;
    // }

    // struct CrowdSessionPayments {
    //     uint amount;
    //     address participant;
    //     string paymentId;
    // }

    // event CrowdSessionCreated (
    //     uint amountAsked,
    //     uint amountFunded,
    //     address payable [] participants,
    //     address payable doubtSolver,
    //     string topic,
    //     string id,
    //     bool compeleted
    // );

    // event CrowdSessionEnded (
    //     uint amountAsked,
    //     uint amountFunded,
    //     address payable [] participants,
    //     address payable doubtSolver,
    //     string topic,
    //     string id,
    //     bool compeleted
    // );

    // event CrowdSessionFunded (
    //     uint amountAsked,
    //     uint amountFunded,
    //     address payable [] participants,
    //     address payable doubtSolver,
    //     string topic,
    //     string id,
    //     bool compeleted
    // );

    // function createCrowdSession(uint amount,string memory topic,string memory id) public {
    //     // Check for valid info
    //     require(bytes(topic).length > 0);
    //     require(bytes(id).length > 0);
    //     require(amount > 0);
    //     // Check transaction amount
    //     //require(msg.value == amount);
    //     // Create session
    //     sessions[id] = Session(amount,0,[],msg.sender,topic,id,false);
    //     // Trigger and emit event
    //     emit CrowdSessionCreated(amount,0, [], msg.sender, topic, id, false);
    // }

    // function fundCrowdSession(string memory crowdSessionId, string memory paymentId) payable public {
    //     Session memory _session = sessions[id];
    //     payments[paymentId] = CrowdSessionPayments(msg.value, msg.sender, crowdSessionId, paymentId);
    //     _session.amountFunded += msg.value;
    //     _session.participants.push(msg.sender);
    //     sessions[id] = _session;
    //     emit CrowdSessionFunded(_session.amountAsked,_session.amountFunded, _session.participants, _session.doubtSolver, _session.topic, _session.id, _session.completed);
    // }

    // function refundCrowdSession(string memory id) public {
    //     Session memory _session = sessions[id];
    //     address payable _participants = _session.participants;
    //     for(let i=0;i<_participants.length;i++){
    //         address(payments(_participants[i].participant)).transfer(payments(_participants[i].amount));
    //     }
    //     _session.completed= true;
    //     Update the session
    //     sessions[id] = _session;
    //     // Trigger and emit event
    //     emit CrowdSessionEnded(_session.amountAsked,_session.amountFunded, _session.participants, _session.doubtSolver, _session.topic, _session.id, _session.completed);
    // }

    // function endCrowdSession(string memory id) payable public {
    //     // Fetch the session
    //     Session memory _session = sessions[id];
    //     // Fetch address of doubt solver
    //     address payable _doubtSolver = _session.doubtSolver;
    //     // Pay the doubt solver by sending them Ether
    //     address(_doubtSolver).transfer(_session.amountAsked);
    //     // Update the completion
    //     _session.completed = true;
    //     // Update the session
    //     sessions[id] = _session;
    //     // Trigger and emit event
    //     emit CrowdSessionEnded(_session.amountAsked,_session.amountFunded, _session.participants, _session.doubtSolver, _session.topic, _session.id, _session.completed);
    // }

}