/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-17 14:56:51
 * @version $Id$
 */

class S_html extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value||'',
            id:(new Date()).getTime()+(this.props.id||'CC1'),
        };
    }

    //为什么会走更新的，就是因为Goods render了两次(初始-网络数据)  (new Date()).getTime()
    // componentWillMount() {
    //     this.setState({
    //         goods_desc: this.props.goods_desc ? this.props.goods_desc : '',
    //     });
    // }

    // 组件更新props
    

    componentDidMount() {
        const names = "goods_detail_content_"+this.state.id;
        document.getElementById(names).innerHTML = this.state.value;
    }

    //更新完毕
    componentDidUpdate() {
        const names = "goods_detail_content_"+this.state.id;
        document.getElementById(names).innerHTML = this.state.value;
    }

    render() {
        return (
            <div className="S_html" id={"goods_detail_content_"+this.state.id}/>
        );
    }
}

export default S_html; 