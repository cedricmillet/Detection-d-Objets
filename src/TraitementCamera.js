class TraitementCamera {
			constructor(video, canvas_affichage, canvas_reference, refresh_interval) {

				


				this.video = video;
				this.video.playbackRate = 0.6;	//video.mp4 est un peu trop rapide, on la ralentie un peu
				//image soustraite = imange_ancienne - image_nouvelle
				this.canvas = canvas_affichage;
				this.ctx = this.canvas.getContext('2d');
				this.w =this.canvas.width;
				this.h =this.canvas.height;
				//image référence
				this.image_reference = new Jimage(this.w, this.h);
				this.ctx_reference = canvas_reference.getContext('2d');
				//image nouvelle
				this.nouvelle = new Jimage(this.w, this.h);
				this.flag = false;
				this.count_soustraction = 0;

				//timer screenshot
				setInterval(function(_this) {	_this.screenShotVideo();		}, refresh_interval, this);

				this.log('Camera lancée! Fréquence de rafraichissement : '+refresh_interval+'ms');


			}

			//Prendre capture d'ecran de la vidéo à l'instant T, l'image générée sera appelée 'image_nouvelle'
			screenShotVideo()
			{

				//image générée dans canvas nouv
				this.ctx.fillRect(0,0,this.w,this.h);
				var video=document.querySelector('video');
				this.ctx.drawImage(video,0,0,this.w,this.h);
				this.nouvelle.getPixels(this.ctx);
				this.soustraire();
				
				//if(!this.flag || (document.getElementById("camera_enablerefreshreference").checked != false && this.count_soustraction%2==0) )
				if(!this.flag || (document.getElementById("camera_enablerefreshreference").checked) )
				{
					this.image_reference.setData(this.nouvelle.getData());
					this.image_reference.afficher(document.getElementById('canvasvideoreference').getContext('2d'));
					this.flag = true;
					this.log('Chargement image de référence.');
				}
				
			}

			//SOustraire image nouvelle et image reference puis afficher le resultat dans canvas
			soustraire()
			{
				this.count_soustraction++;
				this.image_reference.getPixels(this.ctx_reference);
				if(document.getElementById("camera_enableseuil").checked != false)
				{
					var valeurseuil = parseInt(document.getElementById('camera_valeurseuil').value);
					var img = this.image_reference.soustraire(this.nouvelle).seuiller(valeurseuil);
					img.afficher(this.ctx);
					this.log('Soustraction n°'+this.count_soustraction + ' - avec seuillage à '+valeurseuil);
				}
				else
				{
					this.image_reference.soustraire(this.nouvelle).afficher(this.ctx);
					this.log('Soustraction n°'+this.count_soustraction + ' - sans seuillage');
				}
				
				if(document.getElementById("camera_enabledetection").checked != false)
				this.detecterVoitures(img);
			}

			detecterVoitures(img)
			{
				var precision_recherche = 6;	//precision de la recherche en nombre de pixel
				var taille_max_recherche = 180;	//taille max
				var taille_min_objets = 10;
				var index_voiture = 0;
				var voitures = [];

				for (var y=0;y<img.getHauteur();y+=precision_recherche)
				{
					for (var x=0;x<img.getLargeur();x+=precision_recherche)
					{
						
							var val = img.getPixelAt(y,x,1);
							if(val==255)//blanc
							{
								var startX = x;
								var startY = y;
								var endX = x;
								var endY = y;

								var flag_x = false;
								var flag_y = false;
								//si les XXXX prochains pixels sont identiques
								for(var a=0; a<taille_max_recherche; a++)
								{
									for(var b=0;b<taille_max_recherche;b++)
									{
										if(img.getPixelAt(y,x+a,1)==0 && !flag_x)	//lorsque l'on touche la fin de l'objet et que la fin de l'objet n'a pas encore été trouvée
										{
											//si les 15 pixels a droite de l'objet sont vides, alors l'objet a été trouvé
											var tous_vides = true;
											for(var c=0;c<=15;c++)	
											{
												if(img.getPixelAt(y,x+a+c,1)!=0)
													tous_vides = false;
											}
											if(tous_vides)
											{
												flag_x = true;
												endX = x+a;
											}
										}

										if(img.getPixelAt(y+b,x,1)==0 && !flag_y)
										{
											var tous_vides = true;
											for(var c=0;c<=15;c++)
											{
												if(img.getPixelAt(y+b+c,x,1)!=0)
													tous_vides = false;
											}
											if(tous_vides)
											{
												flag_y = true;
												endY = y+b;
											}
										}
									}
								}


								//si la taille de l'objet est suffisante
								if(endX-startX >= taille_min_objets && endY-startY >= taille_min_objets)
								{
									
									//on dessine le cadre
									var aire = parseInt((endX-startX)*(endY-startY));
									this.ctx.strokeStyle = this.getColorByAireObjet(aire);
									this.ctx.lineWidth = 2;
									this.ctx.font = "15px Arial";
									this.ctx.strokeRect(startX, startY, endX-startX, endY-startY);
									this.ctx.strokeText("O "+parseInt(index_voiture+1),startX,y-5);
									//console.log("REctangle en "+x+";"+y)
									x=endX;
									y=endY;
									voitures[index_voiture] = {
										aire: aire,
										coords: {	startX: startX,
													endX: endX,
													startY: startY,
													endY: endY
												},
									};
									index_voiture++;
								}
							}
							
							
						
					}
				}	
				


				//Affichage des données des objets trouvés
				var texte = "";
				texte += "<h4>Configuration de recherches</h4>";
				texte += "Precision de recherche des objets : "+precision_recherche+"px<br>";
				texte += "Taille maximale tolérée : "+taille_max_recherche+"x"+taille_max_recherche+" (px)<br>";
				texte += "Taille minimale des objets à afficher : "+taille_min_objets+"x"+taille_min_objets+" (px)<br>";
				texte += "<h4>Objets détectés</h4>";
				texte += "Nombre d'objets : "+index_voiture+"<br><br>";
				for(var i=0; i<index_voiture; i++)
				{
					var largeur = parseInt(voitures[i].coords.endX-voitures[i].coords.startX);
					var hauteur = parseInt(voitures[i].coords.endY-voitures[i].coords.startY);
					texte += "<br>----------------- <b>OBJET "+parseInt(i+1)+"</b> -----------------<br>";
					texte += 'Coordonnées rectangle = ('+voitures[i].coords.startX+";"+voitures[i].coords.startY+")<br>";
					texte += 'Dimensions rectangle = ('+largeur+";"+hauteur+")<br>";
					texte += "Ratio Hauteur/largeur : "+parseFloat(largeur/hauteur).toFixed(2)+"<br>";
					texte += "Aire : "+voitures[i].aire+" px²<br>";
				}
				document.getElementById('camera_donnees').innerHTML = "<div class='container'>"+texte+"</div>";
			}


			getColorByAireObjet(aire)
			{
				var color = "cyan";
				if(aire <= 200)
					color = "green";
				else if(aire <=350)
					color = "orange";
				else
					color = "red";
				return color;
			}

			log(texte)
			{
				var console = document.getElementById("logvideo");
				//log
				var date = new Date;
				var date_str = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
				console.innerHTML += '['+date_str  +'] - '+texte+'<br>'; 
				//scroll
				console.scrollTop = console.scrollHeight;
			}
		}
