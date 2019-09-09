import React from 'react';
const TODO_FILTER = {
  'SHOW_ALL': () => true,
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createIput: false,
      isDelete: false,
      isFinish: false,
      tasks: [],
      filter: 'SHOW_ALL',
    };
  }
 
//onclick create button,创建input
  handleCreateClick() {
    this.setState({ ...this.state, createInput: true });
  }

  //用于enter键的回调函数，隐藏之前创建的input
  handleDisableInput() {
    this.setState({ ...this.state, createInput: false});
  }

  //用于Delete, Finish键的亮显
  handleDisplay () {
    this.setState({ ...this.state, isDelete: true, isFinish: true })
  }

//把要增加的tasks放在一个内存暂时存储起来
  handleAddTask = (value) => {
    const newTasks = this.state.tasks.concat({
      id: Utils.generateId(),
      name: value,
      bgColor3: false,
      delLine: false,
    });
    this.setState({ tasks: newTasks });
  };
  
  //相当于之前写的msgitem中的handleclickobject(),用来处理变gray
  handleEditTask = (id) => {
    const newTasks = this.state.tasks.map( (task) => {
      if (id === task.id) {
        task.bgColor3 = !task.bgColor3;
      }
      return task;
    } );
    this.setState({tasks: newTasks});
  };

  handleDeleteBgColor3 = () => {
    const newTasks = this.state.tasks.filter( (task) => !task.bgColor3 );
    this.setState({ ...this.state, tasks: newTasks, isDelete: false, isFinish: false });
  };

  handleFinishDelLine () {
    const newTasks = this.state.tasks.map( (task) => {
      if (task.bgColor3 === true) {
        task.delLine = !task.delLine;
        task.bgColor3 = false;
      }
      return task;
    } );
    this.setState({ ...this.state, tasks: newTasks, isDelete: false, isFinish: false });
  }

  render() {
    const createInput = this.state.createInput;
    const isDelete = this.state.isDelete;
    const isFinish = this.state.isFinish;
    const createClick = this.handleCreateClick.bind(this);
    const disableInput = this.handleDisableInput.bind(this);
    //这句话有点不明白
    const filterTasks = this.state.tasks.filter(TODO_FILTER[this.state.filter]);
    const display = this.handleDisplay.bind(this);
    const editTask = this.handleEditTask.bind(this);
    const onDeleteBgColor3 = this.handleDeleteBgColor3.bind(this);
    const onFinishDelLine = this.handleFinishDelLine.bind(this);
    return (
      <div>
        <CreateButton createInput={createInput} createClick={createClick}/>
        <DeleteButton isDelete={isDelete} isFinish={isFinish} onDeleteBgColor3 = {onDeleteBgColor3}/>
        <FinishButton isDelete={isDelete} isFinish={isFinish} onFinishDelLine = {onFinishDelLine} />
        <Header createInput={createInput} addTask={this.handleAddTask} disableInput={disableInput} dataSource={filterTasks} 
                display={display} editTask={editTask} isFinish={isFinish}/>        
      </div>);
  }
}

//针对于enter键的组件
class Header extends React.Component {  
  handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      //这行应该还有其他的书写方式，用来把input消失。
      this.props.disableInput(); 
      this.props.addTask(event.target.value);
      // event.target.value = '';
      }
    }
    render() {
      const createInput = this.props.createInput;
      const dataSource = this.props.dataSource;
      const display = this.props.display;
      const editTask = this.props.editTask;
      const isFinish = this.props.isFinish;
      return (
        <div>
          {createInput ? <input
          onKeyDown={this.handleKeyDown}
          placeholder="my todo item..."
          autoFocus
          /> : null}
         <MessageList dataSource={dataSource} display={display} editTask={editTask} isFinish={isFinish} />
        </div>
      )
    }
  }

class MessageList extends React.Component {
  render() {
    const display = this.props.display;
    const editTask = this.props.editTask;
    const isFinish = this.props.isFinish;
    return (
      <ul style={{ paddingLeft: 0, margin: 0 }}>
        {/* 在调试style的时候，可以用border进行框限 */}
        {/* {<p style={{margin: 0}}>dfsdfsd</p>} */}
        {/* 一个好的经验法则是：在 map() 方法中的元素需要设置 key 属性。 */}
        {this.props.dataSource.map( (item) =>{
          return (
            <MsgItem 
            key={item.id}
            data={item}
            display={display} 
            editTask={editTask}
            isFinish={isFinish}
            />
          );
          })
        }   
      </ul>
    );
  }
}

//MsgItem把dataSource中的元素显示出来
class MsgItem extends React.Component {
  handleClickObject() {
    const editTask = this.props.editTask;
    editTask(this.props.data.id, this.props.data.name);
    const display = this.props.display;
    display();
  }

  render() {
    const styleObj = {
      background: !this.props.data.bgColor3 ? '' : 'gray',
      textDecoration: !this.props.data.delLine ? '' : 'line-through'
    }
    return (
      <div> 
         <label style={styleObj} onClick={this.handleClickObject.bind(this)}>{this.props.data.name}</label>
         {/* <label style={{ background: !this.props.data.bgColor3 ? '' : 'gray',  textDecoration: !this.props.data.delLine ? '' : 'line-through'}} onClick={this.handleClickObject.bind(this)}>{this.props.data.name}</label> */}  
      </div>
    )
  }
}

// 用函数随机生成的id作为key
class Utils {
  static generateId() {
    let random;
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }
}

class CreateButton extends React.Component {
  render() {
    return (
      <div className="cre" style={{ display: 'inline-block' }}>
        <button className="create" onClick={this.props.createClick}>
          Create
        </button>
      </div>
    );
  }
}

class DeleteButton extends React.Component {
  render() {
    const isDelete = this.props.isDelete;
    //闭包
    const onDeleteBgColor3 = ()=> {
      console.log("onDeleteBgColor3");
      this.props.onDeleteBgColor3();
    }
    //等价于下面的
    // const onDeleteBgColor3 = this.props.onDeleteBgColor3;
      return (
        <div className="del" style={{ display: 'inline-block' }}>
          {isDelete ?
          // 断点调试不进去的时候，加console.log()
            <button className="delete" name="Delete" onClick={onDeleteBgColor3} >
              Delete
          </button> :
            <button className="delete" name="Delete" disabled >
              Delete
          </button>}
        </div>
      );
    }
}

class FinishButton extends React.Component {
  render() {
    const isFinish = this.props.isFinish;
    const onFinishDelLine = this.props.onFinishDelLine;
    return (
      <div className="fin" style={{ display: 'inline-block' }}>
        {isFinish ?
          <button className="finish" onClick={onFinishDelLine} >
            Finish
        </button> :
          <button className="finish" disabled >
            Finish
        </button>}
      </div>

    );
  }
}

export default App;