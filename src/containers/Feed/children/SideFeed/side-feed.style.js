import styled from 'styled-components';

export const SideFeedHolder = styled.div`
    width: 25%;
    min-width: 18em;
    max-width: 22em;

    z-index: 1;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
`;


export const RouteContainer = styled.div`
    padding: .6em .6em 0 .6em;

    width: 100%
`;

export const SideFeedHeader = styled.div`
    padding: 1em;
    width: 100%
    text-align: center;

    border-bottom: 1px solid rgba(8, 53, 117, 0.1);
`;

export const FeedRoute = styled.div`
    padding: .5em;
    width: 100%
    height: 4em;
    margin-bottom: .6em;

    display: grid;
    
    border-radius: 5px;
    border: .5px solid rgba(8, 53, 117, 0.1);

    span {
        &.title {
            font-size: .9em;
        }

        &.author {
            font-size: .8em;
            text-align: end;
        }

        &.date{
            font-size: .6em;
            text-align: start;
            color: #808080;
        }
    }

    transition-duration: 200ms;

    cursor: pointer;

    &:hover {
        box-shadow: 0 0px 3px rgba(0, 0, 0, 0.1);
    }
`;
