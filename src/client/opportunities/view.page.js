/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Component from 'react-pure-render/component';
import {Link} from 'react-router';
import {Avatar, CardText, CardHeader, Card} from 'material-ui';
import {DropdownButton, MenuItem} from 'react-bootstrap';

import Loader from '../components/Loader';
import AppContentCanvas from '../components/layout/AppContentCanvas';

class ViewTaskPage extends Component {
  static contextTypes = {
    muiTheme: React.PropTypes.object,
  };

  static propTypes = {
    actions: React.PropTypes.object,
    boards: React.PropTypes.object,
    children: React.PropTypes.object,
    io: React.PropTypes.object,
    msg: React.PropTypes.object,
    params: React.PropTypes.object,
    topicActions: React.PropTypes.object,
  }

  componentDidMount() {
    if (process.env.IS_BROWSER === true) {
      if (this.props.params.id) {
        this.props.topicActions.loadTopic(this.props.params.id);
      }
    }
  }
  comments() {
    if (this.props.boards.viewTopic.type && this.props.boards.viewTopic.type.commentsEnabled) {
      let Comments = require('../topic/components/comments');
      return  (
        <Comments
        actions={this.props.actions}
        comments={this.props.boards.viewTopic.comments}
        io={this.props.io}
        topic={this.props.boards.viewTopic}
        />
      );
    }
  }
  /**
   * @todo: improve breadcrumbs
   * @returns {XML}
   */
  render() {
    const viewTopic = this.props.boards.viewTopic;
    let operaitons = [];
    let i = 0;
    if (viewTopic.operations) {
      viewTopic.operations.forEach(function(op) {
        i++;
        let _style = {};
        let active = false;
        if (viewTopic.workflowStageId === op.id) {
          _style['font-weight'] = 800;
          active = true;
        }
        operaitons.push(<MenuItem active={active} data-operation-id={op.id} eventKey={i} onClick={self.applyOperation}>{op.name}</MenuItem>);
      });
    }
    let style = {
      opacity: this.props.boards.viewTopic.loading === true ? .3 : 1,
      position: 'relative'
    };

    return (
      <div>
        <div className="breadcrumbs-bar" style={{
          background: '#8982A2', // variants: 8C8D98, 7F8090, 7E848E, DAD9E6, FDFDFD
          padding: '5px 15px',
          margin: 0,
          color: '#fff'
        }}>
          <h4>
            <Link style={{color: '#EFEFEF', textDecoration:'underline'}}
                  to='/tasks' >Tasks</Link>
            {this.props.boards.viewTopic.summary && <span> > {this.props.boards.viewTopic.summary}</span>}
          </h4>
        </div>
        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1" style={style}>
          <DropdownButton className="pull-right" eventKey={3} title="">
            {operaitons}
          </DropdownButton>
          {this.props.boards.viewTopic && <h2 style={{fontWeight:800}}>{this.props.boards.viewTopic.summary}</h2>}
          {this.renderContent()}
          <div style={{paddingTop:this.context.muiTheme.rawTheme.spacing.desktopGutter}}>
            {this.comments()}
          </div>
        </div>
      </div>
    );
    /*
     let TopicActions = require('client/boards/_topic/Actions'),
     TopicStore = require('client/boards/_topic/Store'),
     TopicCursorStore = require('client/boards/_topic/CursorStore'),
     TopicFormStore = require('client/boards/_topic/FormStore'),
     Form = require('client/boards/_topic/components/BoardTopicForm');

     var ListActionsRendered = <div>
     <ListActions
     FormComponent={Form}
     FormStore={TopicFormStore}
     /!* who's team do we want to see *!/
     containerStore={this.props.topic}
     Actions={TopicActions}
     TITLE={l20n.ctx.getSync('issues_createForm_TITLE')}
     BUTTON_ACTION_LABEL={<Entity entity='issues_createForm_actionButtonLabel' />}
     />
     <br />
     </div>

     let ListComponent = require('client/project/_issues/components/List.jsx');

     let ListItemComponent = require('client/boards/_topic/components/ListItem.jsx');
     let TopicUsersView = require('client/components/topic/TopicUsers');

     let header = <div>
     <h4 style={{margin:'7px 0px 4px 0'}} className="pull-left">
     {this.props.topic.get('summary')}
     </h4>
     <div className="pull-right" style={{'text-align':'left'}}>
     {ListActionsRendered}
     </div>

     </div>;


     return  <AppContentCanvas header={header}>
     <TopicUsersView
     /!* who's team do we want to see *!/
     containerStore={this.props.topic}
     /!* message if list is empty *!/
     EmptyComponent={EmptyComponent}

     ListComponent={ListComponent}
     ListItemComponent={ListItemComponent}

     Actions={TopicActions}
     Store={TopicStore}
     CursorStore={TopicCursorStore}
     /></AppContentCanvas>*/
  }

  renderContent() {
    const viewTopic = this.props.boards.viewTopic;

    if (viewTopic.loading === true) {
      return (<AppContentCanvas header={
        <h4 className="pull-left"><Loader /></h4>
      }/>);
    }

    return (
      <Card>
        <CardHeader
          avatar={viewTopic.author.username && <Avatar>{viewTopic.author.username.charAt(0)}</Avatar>}
          subtitle={viewTopic.createdOn}
          title={viewTopic.author && <b>{viewTopic.author.username}</b>}
          />
        {this.props.boards.viewTopic.text
        && <CardText>{this.props.boards.viewTopic.text}</CardText>}
      </Card>
    );
  }
}
export default ViewTaskPage;
