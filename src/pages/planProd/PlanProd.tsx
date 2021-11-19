import React from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends React.Component {

    componentDidUpdate() {
      gantt.render();
    }
    componentDidMount() {
        gantt.init("gantt_here");
    }
   
    render() {
      return (
        <div id="gantt_here" style={{width:'calc(100vw - 280px)', height:'800px'}}></div>
      );
    }
  }

