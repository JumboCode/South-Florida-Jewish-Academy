import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const cardStyle = {
  backgroundColor: 'rgb(' + 0 + ',' + 105 + ',' + 176 + ')',
  marginLeft: '43px',
  marginRight:'43px',
  marginTop: '40px'
};

class StudentCard extends React.Component{

    render(){
        // const classes = useStyles();
        const bull = <span >•</span>;
          console.log(this.props, 'props')
        return (
          <Card style={cardStyle}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                  {this.props.name}
              </Typography>
              <Typography variant="h5" component="h2">
                be
                {bull}
                nev
                {bull}o{bull}
                lent
              </Typography>
              <Typography  color="textSecondary">
                adjective
              </Typography>
              <Typography variant="body2" component="p">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        );
    }
    
}


export default StudentCard