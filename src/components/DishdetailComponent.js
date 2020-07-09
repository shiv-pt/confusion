import React, { Component } from 'react';
import { Card, BreadcrumbItem, Breadcrumb, CardImg, CardBody, CardText, CardTitle, Button,
 FormGroup, Label, Modal,ModalHeader,ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors} from 'react-redux-form'
import { Loading } from './loadingComponent'
import { baseUrl } from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components'

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderComments({comments, postComment, dishId}) {
    if (comments != null) {
        return (
            <div className='col-12 col-md-5 m-1'>
                <h4> Comments </h4>
                    <ul className='list-unstyled'>
                        <Stagger in>
                        {comments.map((comment) => {
                            return (
                                <Fade in>
                                <li key={comment.id}>
                                    <p>{comment.comment}</p>
                                    <p>-- {comment.author},
                                    &nbsp;
                                    {new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: '2-digit'
                                        }).format(new Date(comment.date))}
                                    </p>
                                </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment} />

                </div>
            )
        }
        else{
            return (<div></div>);
        }
    }

    function RenderDish({dish}) {
        if (dish != null) {
            return (
                <div className='col-12 col-md-5 m-1'>
                    <FadeTransform in
             transformProps ={{
                 exitTransform: 'scale(0.5) translateY(-50%)'
             }}>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                    </FadeTransform>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }

    const DishDetail = (props) => {
        if(props.isLoading) {
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        const dish = props.dish
        if (dish == null) {
            return (<div></div>)
        }
        return (
            <div className='container'>
                <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
                <div className='row'>
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments} 
                        postComment={props.postComment}
                        dishId={props.dish.id}/>
                </div>
            </div>
        )
    }

    class CommentForm extends Component {
        constructor (props) {
            super(props);
            
            this.state = {
                isModalOpen: false
            };
            this.toggleModal = this.toggleModal.bind(this);
        }
    
        toggleModal(){
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }

        handleSubmit(values) {
            this.toggleModal();
            this.props.postComment(this.props.dishId, values.rating, values.firstname, values.comment)
        }
    
        render() {
            return (
                <>
                <Button onClick={this.toggleModal} type = "button" outline color="secondary"><span className="fa fa-lg fa-pencil"> Submit Comment</span></Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <FormGroup>
                                    <Label htmlFor="rating" >Rating</Label>
                                        <Control.select model=".rating" name="rating" className="form-control" placeholder="1">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        </Control.select>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="firstname" >Your Name</Label>
                                    <Control.text model=".firstname" id="firstname" name="firstname"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                        />
                                        <Errors
                                            className="text-danger"
                                            model=".firstname"
                                            show="touched"
                                            messages={{
                                                required: 'Required ',
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                        />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="5"
                                        className="form-control"></Control.textarea>                                
                                </FormGroup>
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                    </>
            );
        }
    }

export default DishDetail;