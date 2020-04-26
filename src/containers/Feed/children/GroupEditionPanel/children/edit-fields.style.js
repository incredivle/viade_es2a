import styled from 'styled-components';

export const EditFieldsWrapper = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;

    z-index: 1;
`;

export const EditFieldsFriends = styled.div`
    background-color: #fff;
    margin: 1em auto;

    display: flex;
    flex-direction: column;

    box-shadow: 0 0px 3px rgba(8,53,117,0.3);
    border-radius: 4px;

    width: 90%;
    padding: 1em;

    table {
        td {
            border-radius: 4px;
            display: flex;
            padding: .75em;
            margin-right: .3em;
        }

        tr {
            border-radius: 4px;
            transition-duration: 200ms;

            &.selected {
                background: rgba(124, 77, 255, 0.46);
                color: black;
            }

            img {
                border-radius: 50%;
                height: 2em;
            }
        }
    }
`;

export const MemberLine = styled.div`
    background-color: white;
    margin: 1em auto;

    display: flex;

    box-shadow: 0 0px 3px rgba(8,53,117,0.3);
    border-radius: 4px;
    
    width: 90%;
    padding: 1em;
`;