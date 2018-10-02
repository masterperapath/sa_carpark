CREATE OR REPLACE FUNCTION audit.EM13_DELETE_SUBGROUP(pi_group_id character varying, pi_subgroup_id character varying, pi_mid character varying, pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
	DELETE 	FROM subgrp_mid_relate
			WHERE i_group_id = pi_group_id::NUMERIC
			  AND i_subgrp_id = pi_subgroup_id::NUMERIC	
			  AND i_mid_id = pi_mid::NUMERIC;
		
	RETURN audit.em13_select_subgroup_detail(pi_subgroup_id,pi_group_id,pi_username);
END
$function$
