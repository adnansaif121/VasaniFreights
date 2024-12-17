import { useEffect, useState } from "react";
import { Input, Button } from 'antd';
const ViewDriverDetails = () => {
    return (
        <div>
            <h3>Cash Given</h3>

            <hr />

            <h3>Expenses : </h3>
            <table>
                <tbody>
                    <tr>
                        <th>Expense</th>
                        <th>Amount</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>
                            <Input placeholder="Expense name"></Input>
                        </td>
                        <td>
                            <Input placeholder="Amount"></Input>
                        </td>
                        <td>
                            <Button>Add Expense</Button>
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}

export default ViewDriverDetails;