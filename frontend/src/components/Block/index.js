import React, { useState } from 'react'
import Modal from 'react-modal';
import { ListGroup, Button } from 'react-bootstrap'
import blockService from '../../services/blockService'

const rootElement = document.getElementById("root");
Modal.setAppElement(rootElement);

const customStyles = {
	content : {
	  top                   : '50%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto',
	  marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '500px'
	}
  };

const BlockList = ({ blockuser }) => {
	var subtitle;
	const [modalIsOpen,setIsOpen] = useState(false);
    
    function openModal() {
        setIsOpen(true);   
    }

    function unblockUser(id) {
        var coords = JSON.parse(window.localStorage.getItem('loggedMatchaUser'));
        var from_user_id = coords.user_id;
        var to_user_id = id;
        var userObject = {
            from_user_id,
            to_user_id
        }
        blockService.unblockUser(userObject)
        .then(res => {
            alert(res.message);
            window.location.href = "http://localhost:3000/profile";
        })
    }

	function afterOpenModal() {
		subtitle.style.color = '#f00';
	  }
	 
	  function closeModal(){
		setIsOpen(false);
    }
    
	return <>
		<Button onClick={openModal} variant="primary">Block list</Button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal">
		<h3 ref={_subtitle => (subtitle = _subtitle)} id="list">Block list</h3>
        {blockuser && blockuser.length > 0
			? <ListGroup className="text-left" variant="flush">
				{blockuser.map(u => <div key={u.user_id}>
						<ListGroup.Item style={{with: "400px"}}>
							<div style={{display: "inline-block", width: "60%"}}><h3 style={{color: "blue"}}>{u.username}</h3></div>
              <div style={{display: "inline-block", width: "40%", textAlign: "right"}}><Button onClick={() => unblockUser(u.user_id)} variant="warning">Unblock</Button></div>
						</ListGroup.Item>
				</div>)}
			</ListGroup>
			: <div className="text-info">Your block list is empty</div>
        }
        </Modal>
	</>
}

export default BlockList;