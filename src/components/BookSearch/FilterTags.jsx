import * as React from "react"
import styles from "./FilterTags.scss"
import {connect} from "react-redux";
import {getCookie} from "../../containers/Root.js";

@connect(state => {
    return {
        ...getCookie(),
    };
})
class FilterTags extends React.Component{

    render() {
        const {item,count} = this.props;
        return(
                <div className={styles.onetag}>
                    <input type="checkbox" value="None" name="tag" className={styles.checkbox} />
                    <label className={styles.tag}>{item}</label>
                    <span>{count}</span>
                </div>
        );
    }
}

export default FilterTags;