class  Jimage{
	//====================================================================
        //Exercice 1: Constructeur
	//====================================================================
	constructor(largeur, hauteur){
		this.couches = 4; // nb de couches
		this.pixels  = [];
  		
		for(var i=0 ; i< largeur*hauteur*4 ;i++){
			this.pixels[i] = 0 ;
		}
		//A développer ici
		this.largeur = largeur;
		this.hauteur = hauteur;

		/*
			> Propriétés :
				couches
				pixels
				hauteur
				largeur
		*/
	} 
	getLargeur(){return this.largeur;}
	getHauteur(){return this.hauteur;}
	getCouches(){return this.couches;}


	getData(){return this.pixels;}
	setData(pixels){this.pixels=pixels}

	getTaille(){
       return this.largeur*this.hauteur*this.couches;
	}

    ouvrir(context, path){
        var photo   = new Image();
        // chemin vers l'image depuis le document index
        // pour utiliser la methode getImageData, l'image doit être
        // stockée sur le serveur
        photo.src = path;
        
        // on attend que l'image soit chargée pour l'afficher
        var h =this.hauteur;
        var l =this.largeur;

        photo.addEventListener('load', function(){
            context.drawImage(photo, 0, 0, l, h); 
        	console.log('l image est affichée');
       } );



    }

    effacer(context){ 
        context.clearRect(0, 0, this.largeur, this.hauteur);
        this.pixels  = [];
		for(var i=0 ; i< this.taille ;i++){
			this.pixels[i] = 0 ;
		}
    }


    getPixels(context){
	    this.pixels = [];
	    //console.log('test (', this.largeur, ';', this.hauteur, ')')
		var imageData = context.getImageData(0,0,this.largeur,this.hauteur);
        var data = imageData.data;
        for(var i = 0 ; i < data.length ; i++ ){
                 this.pixels[i]   = data[i]; 
        }

    }

 
    

	afficher(context){
	   var imageData = context.createImageData(this.largeur,this.hauteur);
       var pix = imageData.data;
       for(var i = 0 ; i < pix.length ; i++ ){
                 pix[i]   = this.pixels[i]; 
        }  
        context.putImageData( imageData , 0 , 0 );
        console.log("l'image est affichée");
	}

	/*===========================================================
	//Exercice 2 : Vérifier s'il un point (y,x) se trouve dans la zone d'image
	// Oui: si c'est dedans, Non: sinon
	============================================================*/
	estDansImage(y,x)
	{
	//A développer ici	

		//si x appartient à l'intervalle [0; largeurImage[
		//et y appartient à l'intervalle [0; hauteurImage[ alors true sinon false
		if(	x<this.getLargeur() 
			&& y<this.getHauteur() 
			&& x>-1 
			&& y>-1	)		
			return true;
		return false;		
	}



	/*/===========================================================
	//Exercice3 :  Développer la méthode getPosition(y,x,c) pour déterminer la position du pixel (y,x,c) dans le tableau de données pixels
	//===========================================================*/
	
	getPosition(y,x,c)
	{
	
		var rs=-1;
		var w = this.getLargeur();
        var h = this.getHauteur();
		var layers=this.getCouches();

		//A développer ici
		if(this.estDansImage(y,x))	//si le pixel est bien dans l'image
			rs = parseInt( (y*w+x)*layers+c );	//calcul de l'index du pixel a partir de ses coordonnées (x,y,c) avec Index=(y*largeur+x)*nb_couches+c

		return rs;		
	}

	/*/===========================================================
	//Exercice 4 :  Développer la méthode getPixelAt(y,x,c) pour déterminer la valeur du pixel (y,x,c)
	//===========================================================*/
	getPixelAt(y,x,c)
	{
	
		var pix=0;
		var pos=this.getPosition(y,x,c);
		//A développer ici
		if(this.estDansImage(y,x))	//si le pixel est bien dans l'image
			pix = this.getData()[pos];	//on retourne la valeur de pixel a l'aide de son index et du tableau de pixels
		
		return pix;		
	}
	
	/*/===========================================================
	//Exercice 5 :  Modifier la valeur du pixel (y,x,c)  par la valeur val
	//===========================================================*/
	setPixelAt(y,x,c,val)
	{
		var pos=this.getPosition(y,x,c);
		//A développer ici

		//Bornage de la valeur du pixel dans l'intervalle [0;355]
		if(val<0) val=0;
		if(val>255) val=255;
		//Si pixel(x, y) est bien dans l'image, on modifie le table 1D à l'index calculé (pos)
		if(this.estDansImage(y,x))
			this.pixels[pos] = val;
	}

	

	 /*===========================================================
	//Exercice 6 : Convertir en image de niveau de gris
	============================================================*/
	niveaugris()
	{
		let img=new Jimage(this.getLargeur(),this.getHauteur());
		for (var y=0;y<this.getHauteur();y++)
			for (var x=0;x<this.getLargeur();x++)
			{
				img.setPixelAt(y,x,3,this.getPixelAt(y,x,3));
				var p=(this.getPixelAt(y,x,0)+this.getPixelAt(y,x,1)+this.getPixelAt(y,x,2))/3;	//moyenne de la valeur des 3 couches (RVB)
				//A développer ici

				//Bornage de la valeur du pixel dans l'intervalle [0;355]
				if(p<0) p=0;
				if(p>255) p=255;
				//Pour chaque couche (RVB) on modifie la valeur du pixel par la valeur moyenne calculée
				for (var c=0;c<3;c++)
					img.setPixelAt(y,x,c,p);
			}
		return img;
	}

	 /*===========================================================
	//Exercice 7 : Seuiller une image par le seuil 128
	============================================================*/
	seuiller(seuil=128)
	{
		let img=new Jimage(this.getLargeur(),this.getHauteur());
		for (var y=0;y<this.getHauteur();y++)
			for (var x=0;x<this.getLargeur();x++)
			{
				img.setPixelAt(y,x,3,this.getPixelAt(y,x,3));
				//A développer ici
				//Calcul de la valeur moyenne des 3 canaux du pixel(x,y) et test si supérieur à 128
				var superieurseuil=((this.getPixelAt(y,x,0)+this.getPixelAt(y,x,1)+this.getPixelAt(y,x,2))/3) > seuil;
				if(superieurseuil)	//si valMoyenne > 128
				{
					for (var c=0;c<3;c++)	//	Pour chaque canal (RVB)
						img.setPixelAt(y,x,c,255);	//Modification de la valeur du pixel(x,y,c) par 255
				}
				else 				//sinon
				{
					for (var c=0;c<3;c++)	//	Pour chaque canal (RVB)
						img.setPixelAt(y,x,c,0);	//Modification de la valeur du pixel(x,y,c) par 0
				}
				//Avec ces deux valeurs, l'image obtenue sera une image binaire à deux valeurs (0, 255)
			}
		return img;
	}


        
	
	 /*===========================================================
	//Exercice 8 : Additionner une image avec une  valeur
	============================================================*/
	additionner(val)
	{
		

		let img=new Jimage(this.getLargeur(),this.getHauteur());
		for (var y=0;y<this.getHauteur();y++)
			for (var x=0;x<this.getLargeur();x++)
			{
				img.setPixelAt(y,x,3,this.getPixelAt(y,x,3));
				for (var c=0;c<3;c++)
				{
				var p;
				//A développer ici
 				p=this.getPixelAt(y,x,c)+val;	//Valeur_pixel += val...
 				//	Bornage de la valeur du pixel dans intervalle [0, 255]
 				if(p>255) p=255;
 				if(p<0)	 p=0;
 				//	Attribution de la nouvelle valeur pour le pixel(y,x,c)
				img.setPixelAt(y,x,c,p);			
				}			
			}
		return img;
	}

	 /*===========================================================
	//Exercice 9 : Soustraire deux images
	============================================================*/
	soustraire(Im)
	{
		if ((Im.getLargeur()!=this.getLargeur())||(Im.getHauteur()!=this.getHauteur()))
		{
			warning ('2 images n\'ont pas la même taille\n');
  		}

		let img=new Jimage(this.getLargeur(),this.getHauteur());
		for (var y=0;y<this.getHauteur();y++)
			for (var x=0;x<this.getLargeur();x++)
			{
				img.setPixelAt(y,x,3,this.getPixelAt(y,x,3));
				for (var c=0;c<3;c++)
				{
				var p;
				//A développer ici 

				// I'(y,x,c)=I(y,x,c)-Im(y,x,c)
				p = this.getPixelAt(y,x,c)-Im.getPixelAt(y,x,c);
				//	Bornage de la valeur pixel dans intervalle [0, 255]
				if(p>255) 	p=255;
 				if(p<0)	 	p=0;	
 				//	Attribution nouvelle valeur à l'image générée
				img.setPixelAt(y,x,c,p);			
				}			
			}
		return img;
	}

	/*===========================================================
	//Exercice 10a : Additionner 2 images
	============================================================*/

	additionnerImg(Im)
	{
		var mLargeur=(this.getLargeur()>Im.getLargeur())?this.getLargeur():Im.getLargeur();
		var mHauteur=(this.getHauteur()>Im.getHauteur())?this.getHauteur():Im.getHauteur();
		var img=new Jimage(mLargeur,mHauteur);
		console.log(mLargeur,mHauteur);

		for (var y=0;y<mHauteur;y++)
		{
			for (var x=0;x<mLargeur;x++)
			{
				img.setPixelAt(y,x,3,255);
				for (var c=0;c<3;c++)	//condition originale: c<2, on remplace par c<3 ??
				{
				var pix1=0;
				var pix2=0;
				//A développer ici

				
				//Stockage des valeurs des deux pixels a additionner
				pix1=this.getPixelAt(y,x,c);
				pix2=Im.getPixelAt(y,x,c);

				//On additionne les deux valeurs stockées
				var pix = pix1+pix2;

				//	Bornage de la valeur dans intervalle [0, 255]
 				if(pix>255) 	pix=255;
 				if(pix<0)	 	pix=0;

				
 				//	On attribue au pixel(y,x,c) de l'image générée la nouvelle valeur bornée 
				img.setPixelAt(y,x,c,pix);
				}				
			}
		}

		return img;
	}

	/*===========================================================
	//Exercice 10b : Additionner 2 images
	============================================================*/
	additionnerImg2(Im)
	{
		if ((Im.getLargeur()!=this.getLargeur())||(Im.getHauteur()!=this.getHauteur()))
		{
			warning ('2 images n\'ont pas la même taille\n');
  		}

		let img=new Jimage(this.getLargeur(),this.getHauteur());
console.log(img.getLargeur(),img.getHauteur());
		for (var y=0;y<this.getHauteur();y++)
			for (var x=0;x<this.getLargeur();x++)
			{
				img.setPixelAt(y,x,3,this.getPixelAt(y,x,3));
				for (var c=0;c<3;c++)
				{
				//A développer ici 
				var p = this.getPixelAt(y,x,c)+Im.getPixelAt(y,x,c);
 				if(p>255) p=255;
 				if(p<0)	 p=0;

				img.setPixelAt(y,x,c,p);			
				}			
			}
		return img;
	}
	
}
