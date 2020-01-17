import React from "react";
import StudentCard from "./StudentCard";

// eslint-disable-next-line require-jsdoc
class AllCards extends React.Component {
  // eslint-disable-next-line require-jsdoc
  render() {
        const { info } = this.props;
        return (
            <>
                {info.map(({ basic_info, id, form_ids }) => {
                    const {
                        first_name,
                        middle_name,
                        last_name,
                        email
                    } = basic_info;
                    const name = `${first_name} ${middle_name.substring(
                        0,
                        1
                    )}. ${last_name}`;
                    return (
                        <StudentCard
                            key={email}
                            name={name}
                            email={email}
                            id={id}
                            forms={form_ids}
                        ></StudentCard>
                    );
                })}
            </>
        );
    }
}

export default AllCards;
