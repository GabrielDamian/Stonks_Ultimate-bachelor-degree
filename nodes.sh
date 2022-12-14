nodePath="back-end/core/bussiness/DeploymentPipes"
genericNode="./env/bin/python3 ./Generic_Node.py"

# Balancer
pipesBalancer="cd $nodePath && ./env/bin/python3 ./Balancer.py"

node_1="cd $nodePath && $genericNode stage_1 pipe_1_stage_1 pipe_1_stage_2 stage_1"
node_2="cd $nodePath && $genericNode stage_2 pipe_1_stage_2 pipe_1_stage_3 stage_2"
node_3="cd $nodePath && $genericNode stage_3 pipe_1_stage_3 pipe_1_stage_4 stage_3"
node_4="cd $nodePath && $genericNode stage_4 pipe_1_stage_4 balancer-releaser stage_4"

gnome-terminal --geometry=260x25-0+0 \
--tab -t "Pipes Balancer" -e "bash -c '$pipesBalancer'" \
--tab -t "Node_1" -e "bash -c '$node_1'" \
--tab -t "Node_2" -e "bash -c '$node_2'" \
--tab -t "Node_3" -e "bash -c '$node_3'" \
--tab -t "Node_4" -e "bash -c '$node_4'"