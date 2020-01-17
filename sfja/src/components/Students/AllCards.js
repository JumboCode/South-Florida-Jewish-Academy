import React from "react";
import StudentCard from "./StudentCard";

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

                        // <TestCard key={data.basic_info.email} name={data.basic_info.first_name + " " + data.basic_info.middle_name.substring(0,1) + ". " + data.basic_info.last_name} email={data.basic_info.email} id={data.id}></TestCard>
                    );
                })}
            </>
        );
    }
}

export default AllCards;
